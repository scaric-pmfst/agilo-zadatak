import Navbar from "@/components/navbar";
import ProductDetail from "@/components/mainproduct";
import Inspiration from "@/components/inspiration";
import RelatedProducts from "@/components/related-products";
import Footer from "@/components/footer";
import { getFirstProduct, getProducts, DEFAULT_REGION_ID } from "@/lib/medusa";

export default async function Home() {
  // Get the main product
  const { product } = await getFirstProduct();

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
