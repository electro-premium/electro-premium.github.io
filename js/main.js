// === Настройки ===
let allImagesLoaded = false;
const VISIBLE_LIMIT = 2;
const MAX_IMAGES = 30;

// === Загрузка портфолио ===
function loadPortfolioImages(count = VISIBLE_LIMIT) {
  const portfolioGrid = document.getElementById('portfolioGrid');
  if (!portfolioGrid) return;

  // Очищаем галерею
  portfolioGrid.innerHTML = '';
  const sources = [];

  let loadedCount = 0;

  function loadImage(index) {
    if (index > MAX_IMAGES || loadedCount >= count) {
      window.portfolioSources = sources;
      return;
    }

    const imgPath = `img/portfolio/work${index}.jpg`;
    const img = new Image();

    img.onload = () => {
      const el = document.createElement('img');
      el.src = imgPath;
      el.alt = `Работа ${index}`;
      el.loading = "lazy";

      el.onclick = () => {
        const idx = sources.indexOf(imgPath);
        if (idx !== -1) openLightbox(idx);
      };

      portfolioGrid.appendChild(el);
      sources.push(imgPath);
      loadedCount++;

      loadImage(index + 1);
    };

    img.onerror = () => {
      // Пропускаем несуществующие файлы
      loadImage(index + 1);
    };

    img.src = imgPath;
  }

  loadImage(1);
}

function loadInitialPortfolio() {
  loadPortfolioImages(VISIBLE_LIMIT);
}

function loadAllPortfolio() {
  const portfolioGrid = document.getElementById('portfolioGrid');
  if (!portfolioGrid) return;

  portfolioGrid.innerHTML = '';
  const sources = [];

  for (let i = 1; i <= MAX_IMAGES; i++) {
    const imgPath = `img/portfolio/work${i}.jpg`;
    const img = new Image();

    img.onload = () => {
      const el = document.createElement('img');
      el.src = imgPath;
      el.alt = `Работа ${i}`;
      el.loading = "lazy";

      el.onclick = () => {
        const idx = sources.indexOf(imgPath);
        if (idx !== -1) openLightbox(idx);
      };

      portfolioGrid.appendChild(el);
      sources.push(imgPath);
    };

    // Не добавляем в sources при ошибке
    img.src = imgPath;
  }

  window.portfolioSources = sources;
}

// === Кнопка "Показать ещё" / "Скрыть" ===
document.getElementById('showMore')?.addEventListener('click', function () {
  if (allImagesLoaded) {
    loadInitialPortfolio();
    this.textContent = 'Показать ещё';
    allImagesLoaded = false;
  } else {
    loadAllPortfolio();
    this.textContent = 'Скрыть';
    allImagesLoaded = true;
  }
});

// === Lightbox ===
function openLightbox(index) {
  const modalImg = document.getElementById('modalImage');
  const modal = document.getElementById('imageModal');

  if (modalImg && modal && window.portfolioSources) {
    modalImg.src = window.portfolioSources[index];
    modal.style.display = 'flex';
    window.currentLightboxIndex = index;
  }
}

// === Навигация в lightbox ===
document.getElementById('prevBtn')?.addEventListener('click', () => {
  const sources = window.portfolioSources || [];
  if (sources.length === 0) return;

  let idx = window.currentLightboxIndex || 0;
  idx = (idx - 1 + sources.length) % sources.length;
  document.getElementById('modalImage').src = sources[idx];
  window.currentLightboxIndex = idx;
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
  const sources = window.portfolioSources || [];
  if (sources.length === 0) return;

  let idx = window.currentLightboxIndex || 0;
  idx = (idx + 1) % sources.length;
  document.getElementById('modalImage').src = sources[idx];
  window.currentLightboxIndex = idx;
});

// === Закрытие модальных окон ===
document.querySelector('.modal-close')?.addEventListener('click', () => {
  document.getElementById('imageModal').style.display = 'none';
});

document.querySelector('.close')?.addEventListener('click', () => {
  document.getElementById('callModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target.id === 'imageModal' || e.target.id === 'callModal') {
    e.target.style.display = 'none';
  }
});

// === Управление клавишами ===
window.addEventListener('keydown', (e) => {
  if (document.getElementById('imageModal').style.display === 'flex') {
    if (e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
    if (e.key === 'ArrowRight') document.getElementById('nextBtn').click();
    if (e.key === 'Escape') document.getElementById('imageModal').style.display = 'none';
  }
});

// === Кнопка "Наверх" ===
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// === Параллакс ===
function initParallax() {
  const svg = document.querySelector('.bg-desktop img');
  if (!svg) return;

  let scrollOffset = 0, mouseX = 0, mouseY = 0, ticking = false;

  window.addEventListener('scroll', () => {
    scrollOffset = window.scrollY * 0.04;
    requestTick();
  });

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 50;
    mouseY = (e.clientY - window.innerHeight / 2) / 50;
    requestTick();
  });

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateTransform);
      ticking = true;
    }
  }

  function updateTransform() {
    const clampedScroll = Math.min(scrollOffset, 15);
    const x = mouseX * 0.8;
    const y = -clampedScroll + (mouseY * 0.6);
    const rotateY = mouseX * 0.04;
    const rotateX = -mouseY * 0.04;

    svg.style.transform = `
      translate(${x}px, ${y}px)
      rotateY(${rotateY}deg)
      rotateX(${rotateX}deg)
    `;
    ticking = false;
  }
}

// === Умная кнопка звонка ===
function initSmartCall() {
  const modal = document.getElementById('callModal');
  if (!modal) return;

  document.querySelectorAll('a[href^="tel:"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) {
        e.preventDefault();
        modal.style.display = 'block';
      }
    });
  });
}

// === Инициализация ===
document.addEventListener('DOMContentLoaded', () => {
  loadInitialPortfolio();
  initBackToTop();
  initParallax();
  initSmartCall();

});
