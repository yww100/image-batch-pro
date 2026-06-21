export interface SizePreset {
  name: string;
  category: string;
  width: number;
  height: number;
}

export const SIZE_PRESETS: SizePreset[] = [
  { category: 'E-commerce', name: 'Shopify product', width: 2048, height: 2048 },
  { category: 'E-commerce', name: 'Amazon main', width: 2000, height: 2000 },
  { category: 'E-commerce', name: 'Etsy listing', width: 2000, height: 2000 },
  { category: 'E-commerce', name: 'eBay photo', width: 1600, height: 1600 },
  { category: 'Social media', name: 'Instagram post', width: 1080, height: 1080 },
  { category: 'Social media', name: 'Instagram story', width: 1080, height: 1920 },
  { category: 'Social media', name: 'Facebook post', width: 1200, height: 630 },
  { category: 'Social media', name: 'X/Twitter post', width: 1600, height: 900 },
  { category: 'Social media', name: 'Pinterest pin', width: 1000, height: 1500 },
  { category: 'Social media', name: '小红书封面', width: 1242, height: 1660 },
  { category: 'Website', name: 'Hero banner', width: 1920, height: 600 },
  { category: 'Website', name: 'Blog featured', width: 1200, height: 630 },
  { category: 'Website', name: 'Thumbnail', width: 300, height: 300 },
];

export function getCategories(): string[] {
  return Array.from(new Set(SIZE_PRESETS.map((p) => p.category)));
}
