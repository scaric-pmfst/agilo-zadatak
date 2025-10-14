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

export default async function Home({ searchParams }: { searchParams: { id?: string } }) {
  // Get the main product
  console.log(searchParams.id)
  const { product } = await getFirstOrProduct(searchParams.id);

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
