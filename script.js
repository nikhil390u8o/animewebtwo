// --- movie data (static) ---
const MOVIES = {
  solo: {
    id: 'solo',
    title: 'Solo Leveling',
    type: 'mp4',
    preview: 'https://files.catbox.moe/sq4lrf.mp4',
    episodes: [
      { title: 'Episode 1', src: 'https://files.catbox.moe/sq4lrf.mp4' }
    ]
  },
  naruto: {
    id: 'naruto',
    title: 'Naruto',
    type: 'mp4',
    preview: 'https://files.catbox.moe/fe2sb8.mp4',
    episodes: [
      { title: 'Episode 1', src: 'https://files.catbox.moe/fe2sb8.mp4' }
    ]
  },
  demon: {
    id: 'demon',
    title: 'Demon Slayer',
    type: 'mp4',
    preview: 'https://files.catbox.moe/wgturo.mp4',
    episodes: [
      { title: 'Episode 1', src: 'https://files.catbox.moe/wgturo.mp4' }
    ]
  },
  death: {
    id: 'death',
    title: 'Death Note',
    type: 'youtube',
    preview: 'DoZdynyEOyw', // youtube id for ep1
    episodes: [
      { title: 'Episode 1', src: 'DoZdynyEOyw' },
      { title: 'Episode 2', src: 'rarEiOzHyFM' },
      { title: 'Episode 3', src: 'FJu37-u6EDw' }
    ]
  }
};

// modal elements
const videoModal = document.getElementById('videoModal');
const iframeWrap = document.getElementById('iframeWrap');
const videoWrap = document.getElementById('videoWrap');
const previewIframe = document.getElementById('previewIframe');
const previewVideo = document.getElementById('previewVideo');
const episodeList = document.getElementById('episodeList');
const closeModal = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentMovieId = null;
let currentEpisodeIndex = 0;

// open by movie id helper
function openMovieById(id) {
  const movie = MOVIES[id];
  if (!movie) return;
  currentMovieId = id;
  currentEpisodeIndex = 0;
  openVideoModal(movie);
}

// open main modal
function openVideoModal(movie) {
  videoModal.style.display = 'flex';
  videoModal.setAttribute('aria-hidden', 'false');

  // prepare UI
  episodeList.innerHTML = '';

  // show appropriate player
  if (movie.type === 'youtube') {
    videoWrap.style.display = 'none';
    iframeWrap.style.display = 'block';
    // load first episode
    const epId = movie.episodes[0].src;
    previewIframe.src = `https://www.youtube.com/embed/${epId}?autoplay=1&rel=0`;
    // build episode buttons
    movie.episodes.forEach((ep, idx) => {
      const b = document.createElement('button');
      b.textContent = ep.title || `Ep ${idx+1}`;
      b.addEventListener('click', () => changeEpisode(idx));
      episodeList.appendChild(b);
    });
  } else {
    // mp4
    iframeWrap.style.display = 'none';
    videoWrap.style.display = 'block';
    previewVideo.src = movie.episodes[0].src || movie.preview;
    previewVideo.play().catch(()=>{});
    movie.episodes.forEach((ep, idx) => {
      const b = document.createElement('button');
      b.textContent = ep.title || `Ep ${idx+1}`;
      b.addEventListener('click', () => changeEpisode(idx));
      episodeList.appendChild(b);
    });
  }
}

// change episode by index
function changeEpisode(index) {
  const movie = MOVIES[currentMovieId];
  if (!movie) return;
  currentEpisodeIndex = index;
  if (movie.type === 'youtube') {
    const epId = movie.episodes[index].src;
    previewIframe.src = `https://www.youtube.com/embed/${epId}?autoplay=1&rel=0`;
  } else {
    previewVideo.src = movie.episodes[index].src;
    previewVideo.play().catch(()=>{});
  }
}

// prev / next episode helpers
prevBtn.addEventListener('click', () => {
  const movie = MOVIES[currentMovieId]; if (!movie) return;
  if (currentEpisodeIndex > 0) changeEpisode(currentEpisodeIndex - 1);
});
nextBtn.addEventListener('click', () => {
  const movie = MOVIES[currentMovieId]; if (!movie) return;
  if (currentEpisodeIndex < movie.episodes.length - 1) changeEpisode(currentEpisodeIndex + 1);
});

// close modal
closeModal.addEventListener('click', closePlayer);
videoModal.addEventListener('click', (e)=>{ if (e.target === videoModal) closePlayer(); });

function closePlayer() {
  previewIframe.src = '';
  previewVideo.pause();
  previewVideo.src = '';
  videoModal.style.display = 'none';
  videoModal.setAttribute('aria-hidden','true');
}

// Simple slider setup for hero (keeps your existing behavior)
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  let current = 0;
  if (slides.length === 0) return;
  slides.forEach((s,i)=>{
    const type = s.dataset.type;
    const src = s.dataset.src;
    if (type === 'video') {
      const vid = document.createElement('video');
      vid.src = src;
      vid.autoplay = true; vid.loop = true; vid.muted = true;
      vid.style.width = '120%';
      s.appendChild(vid);
    } else {
      s.style.backgroundImage = `url(${src})`;
    }
  });
  slides[current].classList.add('active');
  setInterval(()=>{
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4500);
});

// small search (client-side)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const thumbs = document.querySelectorAll('.anime-thumb');
    thumbs.forEach(t => {
      const text = (t.querySelector('p')?.textContent || '').toLowerCase();
      t.style.display = text.includes(q) ? 'block' : 'none';
    });
  });
}
