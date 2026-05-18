document.addEventListener('DOMContentLoaded', () => {
  const uploader = document.querySelector('.converter-uploader');
  if (!uploader) return;

  const fileInput = uploader.querySelector('.converter-file-input');
  const fileLabel = uploader.querySelector('.converter-file-label');
  const fileNameDisplay = uploader.querySelector('.converter-file-name');
  const convertButton = uploader.querySelector('.converter-action-button');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      fileNameDisplay.textContent = file.name;
      convertButton.removeAttribute('disabled');
    } else {
      fileNameDisplay.textContent = 'No file chosen';
      convertButton.setAttribute('disabled', '');
    }
  });

  convertButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      alert('Please choose a file first.');
      return;
    }

    alert(`Ready to convert: ${file.name}`);
  });
});
