import Medusa from "@medusajs/js-sdk";

const medusa = new Medusa({
  baseUrl: process.env.PUBLIC_MEDUSA_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_API_KEY,
});

export default medusa;
export const DEFAULT_REGION_ID = "reg_01K76GQY5YTDS19PBG97NY4530";

export interface PriceInfo {
  originalPrice: number;
  calculatedPrice: number;
  isOnSale: boolean;
  discountPercentage: number;
}

// Local/Pricing Functions
/**
 * Calculate pricing information based on region
 */
export function calculateVariantPrice(
  variant: any,
  regionId: string
): PriceInfo {
  if (!variant?.prices) {
    return {
      originalPrice: 0,
      calculatedPrice: 0,
      isOnSale: false,
      discountPercentage: 0,
    };
  }

  // Try to find price with region
  const regionPrice = variant.prices.find(
    (p: any) => p.rules?.region_id === regionId
  );

  // Use default price without rules if not found
  const defaultPrice = variant.prices.find(
    (p: any) => !p.rules || Object.keys(p.rules).length === 0
  );

  const priceObj = regionPrice || defaultPrice;
  const original = priceObj ? priceObj.amount : 0;

  // Calculate price with discounts (if there are any)
  const calculated = variant.calculated_price?.calculated_amount
    ? variant.calculated_price.calculated_amount
    : original;

  const onSale = calculated < original && original > 0;
  const discount = onSale
    ? Math.round(((original - calculated) / original) * 100)
    : 0;

  return {
    originalPrice: original,
    calculatedPrice: calculated,
    isOnSale: onSale,
    discountPercentage: discount,
  };
}

/**
 * Get inventory quantity for item variant
 */
export function getVariantInventory(variant: any): number {
  if (!variant?.inventory_items) {
    return 0;
  }

  const inventoryItem = variant.inventory_items[0];
  if (!inventoryItem?.inventory?.location_levels?.[0]) {
    return 0;
  }

  return inventoryItem.inventory.location_levels[0].available_quantity || 0;
}

/**
 * Extract product options by type
 */
export function extractProductOptions(product: any) {
  const colorsOption = product.options?.find(
    (opt: any) => ["color", "colors"].includes(opt.title.toLowerCase()) // In case there's mispelling
  );

  const materialsOption = product.options?.find((opt: any) =>
    ["material", "materials"].includes(opt.title.toLowerCase())
  );

  const colors = colorsOption?.values?.map((v: any) => v.value) || [];
  const materials = materialsOption?.values?.map((v: any) => v.value) || [];

  return { colors, materials };
}

/**
 * Find a variant by selected options
 */
export function findVariantByOptions(
  product: any,
  selectedMaterial: string,
  selectedColor: string
): any | null {
  if (!product.variants) {
    return null;
  }

  return product.variants.find((variant: any) => {
    const variantOptions = variant.options || [];

    const variantMaterial = variantOptions.find(
      (opt: any) =>
        opt.option?.title === "Materials" || opt.option?.title === "Material"
    )?.value;

    const variantColor = variantOptions.find(
      (opt: any) =>
        opt.option?.title === "Colors" || opt.option?.title === "Color"
    )?.value;

    return (
      variantMaterial === selectedMaterial && variantColor === selectedColor
    );
  });
}

/**
 * Get the first variant for initial selection
 */
export function getFirstVariantOptions(product: any) {
  if (!product.variants?.length) {
    return { material: "", color: "" };
  }

  const firstVariant = product.variants[0];

  const material =
    firstVariant.options?.find(
      (opt: any) =>
        opt.option?.title === "Materials" || opt.option?.title === "Material"
    )?.value || "";

  const color =
    firstVariant.options?.find(
      (opt: any) =>
        opt.option?.title === "Colors" || opt.option?.title === "Color"
    )?.value || "";

  return { material, color };
}

// API Functions
/**
 * Fetches product with all necessary data
 */
export async function getProductWithInventory(
  productId: string,
  regionId: string = DEFAULT_REGION_ID
) {
  const response = await medusa.store.product.retrieve(productId, {
    fields:
      "*variants.prices,*variants.inventory_items.inventory.location_levels,*variants.options.option,*variants.calculated_price",
    region_id: regionId,
  });
  return response;
}

/**
 * Fetches first product from Medusa Store (All products with limit to 1)
 */
export async function getFirstOrProduct(
  productId?: string,
  regionId: string = DEFAULT_REGION_ID
) {
  if (productId) {
    return getProductWithInventory(productId);
  }

  const listResponse = await medusa.store.product.list({
    limit: 1,
    region_id: regionId,
  });

  const firstProduct = listResponse.products?.[0];
  if (!firstProduct) {
    throw new Error("No products found in the store.");
  }

  return getProductWithInventory(firstProduct.id);
}

/**
 * Fetch multiple products
 */
export async function getProducts(
  excludeId?: string,
  regionId: string = DEFAULT_REGION_ID,
  limit: number = 10
) {
  const response = await medusa.store.product.list({
    limit,
    region_id: regionId,
    fields: "*variants.prices,*variants.calculated_price,*images",
  });

  // Filter out the main product
  const products = excludeId
    ? response.products.filter((p) => p.id !== excludeId)
    : response.products;

  return products;
}
