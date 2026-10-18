document.querySelectorAll('.video-player').forEach((player) => {
  const loadButton = player.querySelector('.video-load');
  const stopButton = player.parentElement.querySelector('.video-stop');
  const playlistId = player.dataset.playlistId;

  if (!/^PL[a-zA-Z0-9_-]+$/.test(playlistId || '')) return;

  loadButton.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.title = `YouTube-Playlist: ${player.dataset.videoTitle}`;
    iframe.src = `https://www.youtube-nocookie.com/embed?listType=playlist&list=${playlistId}`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    player.querySelector('.video-stage').append(iframe);
    player.classList.add('video-player--active');
    stopButton.hidden = false;
    stopButton.focus();
  });

  stopButton.addEventListener('click', () => {
    player.querySelector('iframe')?.remove();
    player.classList.remove('video-player--active');
    stopButton.hidden = true;
    loadButton.focus();
  });
});
