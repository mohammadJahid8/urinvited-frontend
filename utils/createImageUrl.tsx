export const createImageUrl = (image: any) =>
  typeof image === "string" ? image : image ? URL.createObjectURL(image) : null;
