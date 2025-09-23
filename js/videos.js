// js/videos.js
// Simple YouTube Data API v3 fetch to get the channel's recent videos.
// Instructions: set API_KEY and CHANNEL_ID below.
// CHANNEL_ID example: "UCXXXX..." (You can get it from your channel's About page or from the URL's channel/...)
// NOTE: If you do not provide an API key, the page will show a fallback link.

const API_KEY = "AIzaSyCVzt0HNRNM0e_tbiqS8caK2X4dCZXgZzs";        // <-- PUT YOUR YOUTUBE DATA API KEY HERE (or leave empty for fallback)
const CHANNEL_ID = "UCahMyJn6wjpqEpfi1jZskyg";     // <-- PUT YOUR CHANNEL ID HERE (or leave empty)

const maxResults = 24;

const grid = document.getElementById('videos-grid');
const fallback = document.getElementById('channel-fallback');
const modal = document.getElementById('video-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

function closeModal(){
  modalBody.innerHTML = '';
  modal.setAttribute('aria-hidden','true');
}

function openModal(embedUrl){
  modalBody.innerHTML = `<div class="embed-wrap"><iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  modal.setAttribute('aria-hidden','false');
}

function showFallback(){
  grid.innerHTML = `<div class="fallback-grid">
    <a class="channel-card" href="https://www.youtube.com/@TUAacademy" target="_blank" rel="noopener">
      <h3>Visit TUA Academy on YouTube</h3>
      <p>All videos and playlists are on the channel — click to open YouTube.</p>
    </a>
  </div>`;
  fallback.style.display = 'block';
}

if(!API_KEY || !CHANNEL_ID){
  showFallback();
} else {
  // Fetch latest videos using search endpoint
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}`;

  fetch(url)
    .then(r => r.json())
    .then(data => {
      if(!data.items || !data.items.length) {
        showFallback();
        return;
      }
      const items = data.items.filter(it => it.id.kind === 'youtube#video');
      grid.innerHTML = '';
      items.forEach(it => {
        const thumb = it.snippet.thumbnails.medium || it.snippet.thumbnails.default;
        const title = it.snippet.title;
        const videoId = it.id.videoId;
        const div = document.createElement('div');
        div.className = 'video-card';
        div.innerHTML = `
          <button class="thumb-btn" data-video="${videoId}" aria-label="Watch ${title}">
            <img src="${thumb.url}" alt="${title}">
            <div class="video-title">${title}</div>
            <div class="video-meta">${new Date(it.snippet.publishedAt).toLocaleDateString()}</div>
          </button>
        `;
        grid.appendChild(div);
      });

      // click listeners
      document.querySelectorAll('.thumb-btn').forEach(btn=>{
        btn.addEventListener('click', ()=> {
          const id = btn.dataset.video;
          openModal(`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`);
        });
      });
    })
    .catch(err => {
      console.error(err);
      showFallback();
    });
}
