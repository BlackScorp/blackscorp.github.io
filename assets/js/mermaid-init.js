document.querySelectorAll('.prose pre > code.language-mermaid').forEach((code) => {
  const diagram = document.createElement('div');
  diagram.className = 'mermaid';
  diagram.textContent = code.textContent;
  code.parentElement.replaceWith(diagram);
});

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'dark'
});

mermaid.run({ querySelector: '.prose .mermaid' });
