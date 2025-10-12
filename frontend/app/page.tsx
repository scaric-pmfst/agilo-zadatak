import Navbar from "@/components/navbar";
import ProductDetail from "@/components/mainproduct";
import Inspiration from "@/components/inspiration";
import Footer from "@/components/footer";
import { getProductWithInventory, DEFAULT_REGION_ID } from "@/lib/medusa";

export default async function Home() {
  const { product } = await getProductWithInventory(
    "prod_01K76JV9KTY69D1ED2SY759MRG"
  );
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
