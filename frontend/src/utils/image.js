const API_BASE_URL = "http://localhost:5000";

export const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

/**
 * Normalizes an image path or URL to a valid full image URL.
 * Handles relative paths, missing slashes, http/https URLs, and base64 strings.
 */
export const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image !== "string") return "";

    const trimmed = image.trim();
    if (!trimmed) return "";

    // If it's already a full web URL or data URI
    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("//") ||
        trimmed.startsWith("data:")
    ) {
        return trimmed;
    }

    // Ensure leading slash for local server uploads
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Returns the best image URL for a given product object, or a fallback URL.
 */
export const getProductImage = (product, fallback = DEFAULT_PRODUCT_IMAGE) => {
    if (!product) return fallback;

    let rawImage = "";
    if (typeof product === "string") {
        rawImage = product;
    } else {
        rawImage =
            product.thumbnail ||
            (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "") ||
            product.image ||
            "";
    }

    const resolved = getImageUrl(rawImage);
    return resolved || fallback;
};
