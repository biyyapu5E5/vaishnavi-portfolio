const NAV_SECTION_IDS = ['about', 'education', 'skills', 'projects', 'internships', 'certifications', 'contact'];
const navLinks = document.querySelectorAll('header nav a[href^="#"]');

function getActiveSectionId() {
    const vh = window.innerHeight;
    let bestId = NAV_SECTION_IDS[0];
    let bestVisible = -1;

    for (const id of NAV_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(vh, rect.bottom);
        const visible = Math.max(0, visibleBottom - visibleTop);
        if (visible > bestVisible) {
            bestVisible = visible;
            bestId = id;
        }
    }
    return bestId;
}

function updateNavActiveState() {
    const activeId = getActiveSectionId();
    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const isActive = href === `#${activeId}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'true');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

let navActiveRaf = 0;
function scheduleNavActiveUpdate() {
    if (navActiveRaf) return;
    navActiveRaf = requestAnimationFrame(() => {
        navActiveRaf = 0;
        updateNavActiveState();
    });
}

window.addEventListener('scroll', scheduleNavActiveUpdate, { passive: true });
window.addEventListener('resize', updateNavActiveState);
window.addEventListener('load', updateNavActiveState);
updateNavActiveState();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const targetSel = this.getAttribute('href');
        if (!targetSel || targetSel === '#') return;
        const target = document.querySelector(targetSel);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        window.setTimeout(updateNavActiveState, 400);
    });
});

new Swiper('.project-swiper', {
    loop: true,
    spaceBetween: 22,
    autoHeight: false,
    grabCursor: true,
    speed: 450,
    pagination: { el: '.projects-carousel .project-carousel-dots', clickable: true },
    navigation: {
        nextEl: '.projects-carousel .project-carousel-next',
        prevEl: '.projects-carousel .project-carousel-prev',
    },
    keyboard: { enabled: true, onlyInViewport: true },
    breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 16 },
        768: { slidesPerView: 2, spaceBetween: 28 },
        1200: { slidesPerView: 2, spaceBetween: 36 },
    },
});

/* Project & internship card lightbox */
(function initCardModal() {
    const modal = document.getElementById('card-modal');
    if (!modal) return;

    const modalBody = modal.querySelector('.card-modal__body');
    const closeTriggers = modal.querySelectorAll('[data-card-modal-close]');

    function openCardModal(sourceCard) {
        const clone = sourceCard.cloneNode(true);
        const h3 = clone.querySelector('h3');
        if (h3) h3.id = 'card-modal-title';

        modalBody.replaceChildren(clone);
        modal.hidden = false;
        modal.classList.add('is-open');
        document.body.classList.add('card-modal-open');

        const closeBtn = modal.querySelector('.card-modal__close');
        closeBtn?.focus({ preventScroll: true });
    }

    function closeCardModal() {
        if (!modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        modal.hidden = true;
        modalBody.innerHTML = '';
        document.body.classList.remove('card-modal-open');
    }

    closeTriggers.forEach((el) => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            closeCardModal();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeCardModal();
        }
    });

    document.querySelectorAll('.project-card, .internship-card').forEach((card) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a.project-btn')) return;
            openCardModal(card);
        });
    });
})();

new Swiper('.internship-swiper', {
    loop: true,
    spaceBetween: 22,
    autoHeight: false,
    grabCursor: true,
    speed: 450,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.internships-carousel .internship-carousel-dots', clickable: true },
    navigation: {
        nextEl: '.internships-carousel .internship-carousel-next',
        prevEl: '.internships-carousel .internship-carousel-prev',
    },
    keyboard: { enabled: true, onlyInViewport: true },
    breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 16 },
        768: { slidesPerView: 2, spaceBetween: 28 },
        1200: { slidesPerView: 2, spaceBetween: 36 },
    },
});

function updateLayout() {
  const nav = document.querySelector("header");
  const navHeight = nav.offsetHeight;
  const screenHeight = window.innerHeight;

  console.log("screenHeight", screenHeight);
  console.log("navHeight", navHeight);
  console.log("screenHeight - navHeight", screenHeight - navHeight);

  document.documentElement.style.setProperty(
    "--nav-height",
    `${navHeight}px`
  );
}

updateLayout();

window.addEventListener("resize", updateLayout);
