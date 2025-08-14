// Cache for storing fetched images to avoid repeated API calls
const imageCache = new Map<string, string>();

export interface UnsplashImage {
  id: string;
  url: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

/**
 * Get a curated image from Unsplash based on a query
 * Now uses only fallback images to avoid OAuth issues
 */
export async function getUnsplashImage(
  query: string,
  width: number = 1200,
  height: number = 600
): Promise<UnsplashImage> {
  const cacheKey = `${query}-${width}x${height}`;
  
  // Return cached result if available
  if (imageCache.has(cacheKey)) {
    const cachedUrl = imageCache.get(cacheKey)!;
    return {
      id: 'cached',
      url: cachedUrl,
      alt: query,
      photographer: 'Picsum Photos',
      photographerUrl: 'https://picsum.photos',
    };
  }

  // Always use fallback images for now
  return getFallbackImage(query, width, height);
}

/**
 * Get multiple images for a gallery or carousel
 * Now uses only fallback images to avoid OAuth issues
 */
export async function getUnsplashImages(
  query: string,
  count: number = 5,
  width: number = 400,
  height: number = 300
): Promise<UnsplashImage[]> {
  // Always use fallback images for now
  return Array.from({ length: count }, (_, i) => 
    getFallbackImage(`${query} ${i}`, width, height)
  );
}

/**
 * Fallback images using Picsum for demo purposes
 */
function getFallbackImage(query: string, width: number, height: number): UnsplashImage {
  const seed = query.replace(/\s+/g, '').toLowerCase();
  const id = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
  
  return {
    id: `fallback-${id}`,
    url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    alt: query,
    photographer: 'Picsum Photos',
    photographerUrl: 'https://picsum.photos',
  };
}

// Pre-defined image queries for different sections
export const imageQueries = {
  hero: ['cryptocurrency blockchain', 'digital finance technology', 'modern trading platform'],
  finance: ['financial technology', 'digital payment', 'cryptocurrency trading'],
  blockchain: ['blockchain network', 'crypto technology', 'digital currency'],
  trading: ['stock market trading', 'financial charts', 'investment platform'],
  community: ['business networking', 'professional team', 'collaborative work'],
  security: ['cybersecurity', 'digital security', 'secure technology'],
  growth: ['business growth', 'financial success', 'upward trend'],
  innovation: ['technology innovation', 'digital transformation', 'modern tech'],
};

/**
 * Get a themed image based on predefined categories
 */
export async function getThemedImage(
  theme: keyof typeof imageQueries,
  width: number = 1200,
  height: number = 600
): Promise<UnsplashImage> {
  const queries = imageQueries[theme];
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  return getUnsplashImage(randomQuery, width, height);
}
