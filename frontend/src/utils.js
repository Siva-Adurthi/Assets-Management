export const formatDate = value => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB");
};

export const errorMessage = error =>
  error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";

export const apiOrigin = () => {
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return base.replace(/\/api\/?$/, "");
};

export const getImageUrl = imageUrl => {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${apiOrigin()}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
};
