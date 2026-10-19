set -euo pipefail

shopt -s nullglob
posts=(_posts/*.md _posts/*.markdown)
if [ "${#posts[@]}" -eq 0 ]; then
  printf '[]\n'
  exit 0
fi

while IFS= read -r -d '' post; do
  metadata=$(awk 'NR == 1 { sub(/\r$/, ""); if ($0 != "---") exit; next } { sub(/\r$/, "") } $0 == "---" { exit } { print }' "$post")
  if ! printf '%s\n' "$metadata" | grep -Eq '^published:[[:space:]]*true[[:space:]]*(#.*)?$'; then
    continue
  fi
  title=$(printf '%s\n' "$metadata" | sed -n 's/^title:[[:space:]]*//p')
  key=$(printf '%s\n' "$metadata" | sed -n 's/^comments_key:[[:space:]]*//p')
  content=$(awk 'BEGIN { delimiters = 0 } { line = $0; sub(/\r$/, "", line) } line == "---" && delimiters < 2 { delimiters++; next } delimiters == 2 { print }' "$post")
  jq -n --arg path "$post" --arg title "$title" --arg key "$key" --arg content "$content" '
    def scalar: gsub("^[[:space:]]+|[[:space:]]+$"; "") |
      if startswith("\"") then fromjson
      elif startswith("\u0027") and endswith("\u0027") then .[1:-1] | gsub("\u0027\u0027"; "\u0027")
      else . end;
    {path: $path, title: ($title | scalar), comments_key: ($key | scalar | if . == "" then null else . end), content: $content}
  '
done < <(grep -LZ -E '^comments_key:[[:space:]]*[^[:space:]]' "${posts[@]}") | jq -s '.'
