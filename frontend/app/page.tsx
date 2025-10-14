import Navbar from "@/components/navbar";
import ProductDetail from "@/components/mainproduct";
import Inspiration from "@/components/inspiration";
import RelatedProducts from "@/components/related-products";
import Footer from "@/components/footer";
import {
  getFirstOrProduct,
  getProducts,
  DEFAULT_REGION_ID,
} from "@/lib/medusa";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {

  const { id } = await searchParams;
  // Get the main product
  console.log(id);
  const { product } = await getFirstOrProduct(id);

  // Get 3 products that serve as related products
  const relatedProducts = await getProducts(product.id, DEFAULT_REGION_ID);

  return (
    <main>
      <Navbar />
      <ProductDetail product={product} regionId={DEFAULT_REGION_ID} />
      <Inspiration />
      <RelatedProducts
        products={relatedProducts}
        regionId={DEFAULT_REGION_ID}
      />
      <Footer />
    </main>
  );
}
