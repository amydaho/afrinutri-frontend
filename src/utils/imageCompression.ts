export async function compressImage(dataUrl: string, maxSizeMB: number = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      const maxWidth = 1920;
      const maxHeight = 1920;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.8;
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      const sizeInMB = (compressedDataUrl.length * 3) / 4 / (1024 * 1024);
      
      if (sizeInMB > maxSizeMB && quality > 0.1) {
        quality = Math.max(0.1, quality - 0.1);
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(compressedDataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}
