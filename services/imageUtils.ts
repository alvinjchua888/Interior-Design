
/**
 * Compresses an image to ensure fast upload and processing.
 * Aims for a max dimension of 1280px while maintaining aspect ratio.
 */
export async function compressImage(base64Str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1280;
      const MAX_HEIGHT = 720;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Canvas context failed');
      
      ctx.drawImage(img, 0, 0, width, height);
      // Using quality 0.8 to balance speed and visual fidelity
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
  });
}

/**
 * Utility to download a base64 encoded image string.
 */
export function downloadBase64Image(base64Data: string, fileName: string) {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
