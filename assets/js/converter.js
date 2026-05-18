const converterConfig = {
  'png-to-jpg': {
    sourceLabel: 'PNG image',
    targetLabel: 'JPG',
    accept: '.png,image/png',
    targetMime: 'image/jpeg',
    targetExt: 'jpg',
    quality: true,
    description: 'Convert PNG images to JPG with optional quality control.',
  },
  'jpg-to-png': {
    sourceLabel: 'JPG image',
    targetLabel: 'PNG',
    accept: '.jpg,.jpeg,image/jpeg',
    targetMime: 'image/png',
    targetExt: 'png',
    quality: false,
    description: 'Convert JPG images to PNG while preserving quality.',
  },
  'png-to-webp': {
    sourceLabel: 'PNG image',
    targetLabel: 'WebP',
    accept: '.png,image/png',
    targetMime: 'image/webp',
    targetExt: 'webp',
    quality: true,
    description: 'Convert PNG images to the modern WebP format.',
  },
  'webp-to-png': {
    sourceLabel: 'WebP image',
    targetLabel: 'PNG',
    accept: '.webp,image/webp',
    targetMime: 'image/png',
    targetExt: 'png',
    quality: false,
    description: 'Convert WebP images back to PNG for broad compatibility.',
  },
  'jpg-to-webp': {
    sourceLabel: 'JPG image',
    targetLabel: 'WebP',
    accept: '.jpg,.jpeg,image/jpeg',
    targetMime: 'image/webp',
    targetExt: 'webp',
    quality: true,
    description: 'Convert JPG images to WebP with adjustable quality.',
  },
  'webp-to-jpg': {
    sourceLabel: 'WebP image',
    targetLabel: 'JPG',
    accept: '.webp,image/webp',
    targetMime: 'image/jpeg',
    targetExt: 'jpg',
    quality: true,
    description: 'Convert WebP images to JPG for compatibility with older browsers.',
  },
  'png-to-svg': {
    sourceLabel: 'PNG image',
    targetLabel: 'SVG',
    accept: '.png,image/png',
    targetMime: 'image/svg+xml',
    targetExt: 'svg',
    quality: false,
    description: 'Wrap PNG images in a lightweight SVG container for vector-friendly usage.',
  },
  'jpg-to-svg': {
    sourceLabel: 'JPG image',
    targetLabel: 'SVG',
    accept: '.jpg,.jpeg,image/jpeg',
    targetMime: 'image/svg+xml',
    targetExt: 'svg',
    quality: false,
    description: 'Wrap JPG images in an SVG file for easy embedding and preview.',
  },
  'png-to-ico': {
    sourceLabel: 'PNG image',
    targetLabel: 'ICO',
    accept: '.png,image/png',
    targetMime: 'image/x-icon',
    targetExt: 'ico',
    quality: false,
    description: 'Convert PNG images into a favicon-ready ICO file.',
  },
  'heic-to-jpg': {
    sourceLabel: 'HEIC image',
    targetLabel: 'JPG',
    accept: '.heic,.heif,image/heic,image/heif',
    targetMime: 'image/jpeg',
    targetExt: 'jpg',
    quality: true,
    description: 'Convert HEIC images to JPG in the browser when supported by your browser.',
  },
  'heic-to-png': {
    sourceLabel: 'HEIC image',
    targetLabel: 'PNG',
    accept: '.heic,.heif,image/heic,image/heif',
    targetMime: 'image/png',
    targetExt: 'png',
    quality: false,
    description: 'Convert HEIC images to PNG in the browser when supported by your browser.',
  },
};

function setErrorStatus(message, statusEl) {
  statusEl.textContent = message;
  statusEl.classList.add('status-error');
  statusEl.classList.remove('status-success');
}

function setSuccessStatus(message, statusEl) {
  statusEl.textContent = message;
  statusEl.classList.add('status-success');
  statusEl.classList.remove('status-error');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load image.'));
    image.src = src;
  });
}

function createIcoBlob(image) {
  return new Promise((resolve, reject) => {
    const size = Math.min(128, image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, size, size);
    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error('Failed to create ICO image.'));
      const pngData = new Uint8Array(await blob.arrayBuffer());
      const header = new ArrayBuffer(22);
      const view = new DataView(header);
      view.setUint16(0, 0, true);
      view.setUint16(2, 1, true);
      view.setUint16(4, 1, true);
      view.setUint8(6, size === 256 ? 0 : size);
      view.setUint8(7, size === 256 ? 0 : size);
      view.setUint8(8, 0);
      view.setUint8(9, 0);
      view.setUint16(10, 1, true);
      view.setUint16(12, 32, true);
      view.setUint32(14, pngData.length, true);
      view.setUint32(18, 22, true);
      const icoBytes = new Uint8Array(header.byteLength + pngData.length);
      icoBytes.set(new Uint8Array(header), 0);
      icoBytes.set(pngData, header.byteLength);
      resolve(new Blob([icoBytes], { type: 'image/x-icon' }));
    }, 'image/png');
  });
}

async function convertImage({ sourceDataUrl, sourceType, targetMime, targetExt, quality }, config) {
  const image = await loadImage(sourceDataUrl);
  if (targetMime === 'image/svg+xml') {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${image.naturalWidth}" height="${image.naturalHeight}">\n  <image href="${sourceDataUrl}" width="${image.naturalWidth}" height="${image.naturalHeight}" preserveAspectRatio="xMidYMid meet" />\n</svg>`;
    return new Blob([svg], { type: 'image/svg+xml' });
  }

  if (targetMime === 'image/x-icon') {
    return createIcoBlob(image);
  }

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Conversion failed.'));
        return;
      }
      resolve(blob);
    }, targetMime, quality);
  });
}

function updatePreviewSlider(value, afterWrapper) {
  afterWrapper.style.width = `${value}%`;
}

function initImageConverter() {
  const pageKey = document.body.dataset.conversion;
  const config = converterConfig[pageKey];
  if (!config) return;

  const converterRoot = document.querySelector('.converter-tool');
  if (!converterRoot) return;

  const fileInput = converterRoot.querySelector('input[type=file]');
  const optionsSection = converterRoot.querySelector('.conversion-options');
  const qualityRow = converterRoot.querySelector('.quality-row');
  const qualityInput = converterRoot.querySelector('#quality');
  const qualityValue = converterRoot.querySelector('#quality-value');
  const convertButton = converterRoot.querySelector('.convert-button');
  const statusMessage = converterRoot.querySelector('#status-message');
  const outputSection = converterRoot.querySelector('.conversion-output');
  const beforeImage = converterRoot.querySelector('#before-image');
  const afterImage = converterRoot.querySelector('#after-image');
  const afterWrapper = converterRoot.querySelector('.after-image-container');
  const previewStack = converterRoot.querySelector('.preview-stack');
  const slider = converterRoot.querySelector('#preview-slider');
  const sliderValue = converterRoot.querySelector('#preview-value');
  const downloadButton = converterRoot.querySelector('#download-button');
  const sourceLabel = converterRoot.querySelector('#source-label');
  const targetLabel = converterRoot.querySelector('#target-label');
  const descriptionText = converterRoot.querySelector('#converter-description');

  let currentOutputUrl = null;
  let currentSelectedFile = null;

  sourceLabel.textContent = config.sourceLabel;
  targetLabel.textContent = config.targetLabel;
  descriptionText.textContent = config.description;
  fileInput.accept = config.accept;

  if (!config.quality) {
    qualityRow.classList.add('hidden');
  }

  function resetOutput() {
    outputSection.classList.add('hidden');
    slider.parentElement.classList.add('hidden');
    if (currentOutputUrl) {
      URL.revokeObjectURL(currentOutputUrl);
      currentOutputUrl = null;
    }
    downloadButton.removeAttribute('href');
    downloadButton.classList.add('hidden');
    beforeImage.src = '';
    afterImage.src = '';
  }

  function showOptions() {
    optionsSection.classList.remove('hidden');
    convertButton.classList.remove('hidden');
    statusMessage.textContent = '';
    outputSection.classList.add('hidden');
    slider.parentElement.classList.add('hidden');
  }

  function handleFileSelected() {
    const file = fileInput.files?.[0];
    if (!file) {
      setErrorStatus('No file selected.', statusMessage);
      optionsSection.classList.add('hidden');
      return;
    }

    const acceptableTypes = config.accept.split(',');
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isExtensionAllowed = acceptableTypes.some((entry) => entry.startsWith('.') && fileExt === entry.slice(1));
    const isTypeAllowed = acceptableTypes.some((entry) => entry.includes('/') && file.type === entry);
    if (!isExtensionAllowed && !isTypeAllowed) {
      setErrorStatus(`Please select a valid ${config.sourceLabel} file.`, statusMessage);
      optionsSection.classList.add('hidden');
      return;
    }

    currentSelectedFile = file;
    resetOutput();
    const reader = new FileReader();
    reader.onload = () => {
      beforeImage.src = reader.result;
      setSuccessStatus(`Selected ${file.name} (${formatBytes(file.size)})`, statusMessage);
      showOptions();
    };
    reader.onerror = () => setErrorStatus('Unable to read the selected file.', statusMessage);
    reader.readAsDataURL(file);
  }

  function handleQualityChange() {
    qualityValue.textContent = String(Math.round(Number(qualityInput.value) * 100));
  }

  async function handleConvert() {
    if (!currentSelectedFile) {
      setErrorStatus('Choose a file before converting.', statusMessage);
      return;
    }

    convertButton.disabled = true;
    setSuccessStatus('Converting image...', statusMessage);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const blob = await convertImage({
            sourceDataUrl: reader.result,
            sourceType: currentSelectedFile.type,
            targetMime: config.targetMime,
            targetExt: config.targetExt,
            quality: config.quality ? Number(qualityInput.value) : undefined,
          }, config);

          if (currentOutputUrl) {
            URL.revokeObjectURL(currentOutputUrl);
          }
          currentOutputUrl = URL.createObjectURL(blob);
          afterImage.src = currentOutputUrl;
          previewStack.classList.remove('hidden');
          outputSection.classList.remove('hidden');
          slider.parentElement.classList.remove('hidden');
          updatePreviewSlider(Number(slider.value), afterWrapper);
          downloadButton.href = currentOutputUrl;
          downloadButton.download = `${currentSelectedFile.name.replace(/\.[^.]+$/, '')}-converted.${config.targetExt}`;
          downloadButton.classList.remove('hidden');
          setSuccessStatus(`Conversion complete. Output size: ${formatBytes(blob.size)}`, statusMessage);
        } catch (error) {
          setErrorStatus(error.message || 'Conversion failed.', statusMessage);
        } finally {
          convertButton.disabled = false;
        }
      };
      reader.onerror = () => {
        setErrorStatus('Unable to read the selected file.', statusMessage);
        convertButton.disabled = false;
      };
      reader.readAsDataURL(currentSelectedFile);
    } catch (error) {
      setErrorStatus(error.message || 'Conversion failed.', statusMessage);
      convertButton.disabled = false;
    }
  }

  fileInput.addEventListener('change', handleFileSelected);
  qualityInput.addEventListener('input', handleQualityChange);
  convertButton.addEventListener('click', handleConvert);
  slider.addEventListener('input', () => {
    updatePreviewSlider(Number(slider.value), afterWrapper);
    sliderValue.textContent = `${slider.value}%`;
  });
  handleQualityChange();
}

document.addEventListener('DOMContentLoaded', initImageConverter);
