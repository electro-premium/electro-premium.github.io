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

// === Показ подсказки свайпа на мобильных ===
function showSwipeHint() {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobile) return;

  const hint = document.getElementById('swipeHint');
  if (!hint) return;

  hint.style.display = 'block';
  hint.classList.add('show');

  setTimeout(() => {
    hint.classList.remove('show');
    setTimeout(() => {
      hint.style.display = 'none';
    }, 300);
  }, 2500);
}

// === Открытие галереи ===
function openLightbox(index) {
  const modalImg = document.getElementById('modalImage');
  const modal = document.getElementById('imageModal');

  if (modalImg && modal && window.portfolioSources) {
    modalImg.src = window.portfolioSources[index];
    modal.style.display = 'flex';
    window.currentLightboxIndex = index;

    // 🔒 Блокируем прокрутку фона
    document.body.style.overflow = 'hidden';

    showSwipeHint();
  }
}

// === Закрытие галереи ===
function closeLightbox() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.style.display = 'none';
    // 🔓 Разблокируем прокрутку
    document.body.style.overflow = '';
  }
}

// === Простая навигация ===
function navigateLightbox(direction) {
  const sources = window.portfolioSources || [];
  if (sources.length === 0) return;

  let idx = window.currentLightboxIndex || 0;
  if (direction === 'next') {
    idx = (idx + 1) % sources.length;
  } else {
    idx = (idx - 1 + sources.length) % sources.length;
  }

  const modalImg = document.getElementById('modalImage');
  if (modalImg) {
    modalImg.src = sources[idx];
  }

  window.currentLightboxIndex = idx;
}

// === Кнопки навигации ===
document.getElementById('prevBtn')?.addEventListener('click', () => {
  navigateLightbox('prev');
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
  navigateLightbox('next');
});

// === Закрытие по крестику и фону ===
document.querySelector('.modal-close')?.addEventListener('click', closeLightbox);

document.getElementById('imageModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'imageModal') {
    closeLightbox();
  }
});

// === Управление клавишами ===
window.addEventListener('keydown', (e) => {
  if (document.getElementById('imageModal').style.display === 'flex') {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
    if (e.key === 'ArrowRight') navigateLightbox('next');
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

// === Простой свайп для мобильных ===
function initSwipe() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;

  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isMobile) return;

  let startX = 0;

  modal.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  modal.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      // Свайп влево → следующее фото
      document.getElementById('nextBtn')?.click();
    } else {
      // Свайп вправо → предыдущее фото
      document.getElementById('prevBtn')?.click();
    }
  });
}

// === Инициализация ===
document.addEventListener('DOMContentLoaded', () => {
  loadInitialPortfolio();
  initBackToTop();
  initParallax();
  initSmartCall();
  initSwipe();

});
