'use strict';
const samples = {
  development: { title: 'Telegram-бот для онлайн-школы', description: 'Запись на занятия, напоминания и интеграция с расписанием. Есть готовое ТЗ.', tags: ['Python', 'Telegram'], budget: 'от 60 000 ₽' },
  design: { title: 'Лендинг для нового бренда', description: 'Нужен дизайнер лендинга с мобильной версией. Структура и референсы готовы.', tags: ['Веб-дизайн', 'Figma'], budget: 'от 35 000 ₽' },
  marketing: { title: 'Контент для бренда одежды', description: 'Ищем SMM-специалиста: темы, публикации и план продвижения. Материалы для старта есть.', tags: ['SMM', 'Контент'], budget: 'от 40 000 ₽' },
  writing: { title: 'Тексты для сайта студии', description: 'Рассказать об услугах и оформить кейсы. Материалы дадим. Нужен живой, понятный язык.', tags: ['Копирайтинг', 'Сайт'], budget: 'от 20 000 ₽' }
};

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu(focus = false) {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  if (focus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
document.addEventListener('click', event => {
  if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const dialog = document.querySelector('.demo-dialog');
document.querySelectorAll('[data-open-demo]').forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.demoCategory;
  if (category && samples[category]) {
    document.querySelector(`.demo-categories [data-category="${category}"]`)?.click();
  }
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    document.body.classList.add('dialog-open');
  } else {
    window.location.href = 'https://t.me/FreeRad_bot';
  }
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
const categoryButtons = [...document.querySelectorAll('[data-category]')];
categoryButtons.forEach(button => button.addEventListener('click', () => {
  const item = samples[button.dataset.category];
  if (!item) return;
  categoryButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  document.querySelector('#sample-title').textContent = item.title;
  document.querySelector('#sample-description').textContent = item.description;
  document.querySelector('#sample-budget').textContent = item.budget;
  document.querySelector('#sample-tags').replaceChildren(...item.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
let paused = false;
try { paused = localStorage.getItem('flrad-paused') === 'true'; } catch {}
function updateMotion(value) {
  paused = value;
  document.documentElement.classList.toggle('motion-paused', value);
  motionButton.setAttribute('aria-pressed', String(value));
  motionButton.setAttribute('aria-label', value ? 'Включить анимации' : 'Приостановить анимации');
  motionButton.querySelector('span').textContent = value ? '▷' : 'Ⅱ';
}
updateMotion(paused);
motionButton.addEventListener('click', () => {
  updateMotion(!paused);
  try { localStorage.setItem('flrad-paused', String(paused)); } catch {}
});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .07, rootMargin: '0px 0px -20px 0px'});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('js-reveal');
}
const sticky = document.querySelector('.mobile-cta');
const hero = document.querySelector('.hero');
const closing = document.querySelector('.closing');
const progress = document.querySelector('.progress');
let ticking = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
  sticky.hidden = !(hero.getBoundingClientRect().bottom < 0 && closing.getBoundingClientRect().top > window.innerHeight - 70);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
}, {passive: true});
window.addEventListener('resize', updateScroll, {passive: true});
window.addEventListener('load', updateScroll, {once: true});
updateScroll();
document.querySelector('#year').textContent = new Date().getFullYear();
