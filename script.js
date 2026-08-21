const tabButtons = document.querySelectorAll('.service-tabs button');
const panels = document.querySelectorAll('.service-panel');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    panels.forEach((panel) => panel.classList.remove('active'));
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    document.getElementById(button.dataset.panel).classList.add('active');
  });
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('mobile-open', !open);
});

const enquiryForm = document.querySelector('#enquiry-form');
const formStatus = document.querySelector('#form-status');
enquiryForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = enquiryForm.elements.name.value.trim();
  const email = enquiryForm.elements.email.value.trim();
  const service = enquiryForm.elements.service.value;
  const message = enquiryForm.elements.message.value.trim();
  const submitButton = enquiryForm.querySelector('button[type="submit"]');
  const config = window.CORE_FIN_SUPABASE_CONFIG;

  if (!config) {
    formStatus.textContent = 'We could not connect to the enquiry service. Please email us directly.';
    return;
  }

  submitButton.disabled = true;
  formStatus.textContent = 'Sending your enquiry…';

  try {
    const response = await fetch(`${config.url}/rest/v1/enquiries`, {
      method: 'POST',
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${config.publishableKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        full_name: name,
        email,
        service_required: service,
        message
      })
    });

    if (!response.ok) throw new Error('Enquiry request failed');

    enquiryForm.reset();
    formStatus.textContent = 'Thank you — your enquiry has been received. We’ll be in touch shortly.';
  } catch (error) {
    formStatus.textContent = 'We could not send your enquiry. Please try again or email us directly.';
  } finally {
    submitButton.disabled = false;
  }
});

const reader = document.querySelector('#article-reader');
const readerArticles = document.querySelectorAll('[data-reader-article]');
document.querySelectorAll('[data-article]').forEach((link) => {
  link.addEventListener('click', () => {
    const article = link.dataset.article;
    reader.classList.add('is-open');
    readerArticles.forEach((item) => item.classList.toggle('active', item.dataset.readerArticle === article));
  });
});
