async function loadPartial(containerId, partialUrl) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(partialUrl);
    if (!response.ok) {
      console.error(`Failed to load partial: ${partialUrl}`, response.statusText);
      return;
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(`Error loading partial: ${partialUrl}`, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.replace(/\/+$/, '');
  const prefix = path.includes('/image-converter/') ? '../' : '';
  loadPartial('site-header', `${prefix}partials/header.html`);
  loadPartial('site-footer', `${prefix}partials/footer.html`);
});
