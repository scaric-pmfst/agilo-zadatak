import Medusa from "@medusajs/js-sdk";

const medusa = new Medusa({
  baseUrl: process.env.PUBLIC_MEDUSA_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_API_KEY,
});
export default medusa;
export const DEFAULT_REGION_ID = "reg_01K76GQY5YTDS19PBG97NY4530";

// Helper Functions
// Fetches product with all necessary data
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

// Fetches first product from Medusa Store (All products with limit to 1)
export async function getFirstProduct(regionId: string = DEFAULT_REGION_ID) {
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

// Fetch multiple products
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
