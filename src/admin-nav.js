import './admin-nav.css';

const addAdminReviewLink = () => {
  const nav = document.querySelector('.nav-tabs');
  if (!nav || nav.querySelector('[data-admin-review-link]')) return;

  const link = document.createElement('a');
  link.href = '/admin.html';
  link.className = 'admin-review-nav';
  link.dataset.adminReviewLink = 'true';
  link.setAttribute('aria-label', 'Admin review');
  link.innerHTML = '<span aria-hidden="true">✓</span> Admin review';
  nav.append(link);
};

const observer = new MutationObserver(addAdminReviewLink);
observer.observe(document.documentElement, { childList: true, subtree: true });
addAdminReviewLink();
