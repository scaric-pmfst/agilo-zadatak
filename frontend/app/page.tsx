import Navbar from "@/components/navbar";
import ProductDetail from "@/components/mainproduct";
import Inspiration from "@/components/inspiration";
import Footer from "@/components/footer";
import {
  getProductWithInventory,
  getFirstProduct,
  DEFAULT_REGION_ID,
} from "@/lib/medusa";

export default async function Home() {
  const { product } = await getFirstProduct();
  const safeProduct = JSON.parse(JSON.stringify(product));
  return (
    <main>
      <Navbar />
      <ProductDetail product={safeProduct} regionId={DEFAULT_REGION_ID} />
      <Inspiration />
      <Footer />
    </main>
  );
}
