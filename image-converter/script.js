function convertImage() {
    const fileInput = document.getElementById('file');
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                // Convert the image to PNG
                const convertedImage = canvas.toDataURL('image/png');

                // Create a download link for the converted image
                const downloadLink = document.createElement('a');
                downloadLink.href = convertedImage;
                downloadLink.download = 'converted_image.png';

                // Trigger the download
                downloadLink.click();
            };
        };

        reader.readAsDataURL(file);
    }
}