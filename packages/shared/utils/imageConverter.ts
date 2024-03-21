
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const displayImageFromBase64 = (base64ImageString: string, imgElementId: string) => {
  const imgElement = document.getElementById(imgElementId) as HTMLImageElement;
  if (!imgElement) {
    console.error('Image element not found');
    return;
  }
  imgElement.src = base64ImageString;
};
