import Navbar from "@/components/navbar";
import ProductDetail from "@/components/mainproduct";
import image1 from "@/public/inspiration/image1.png";
import image2 from "@/public/inspiration/image2.png";
import Inspiration from "@/components/inspiration";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <ProductDetail
        title="Paloma Haven"
        collection="Modern Luxe"
        price={12000}
        description="Minimalistic designs, neutral colors, and high-quality textures. Perfect for those who seek comfort with a clean and understated aesthetic. This collection brings the essence of Scandinavian elegance to your living room."
        materials={["Linen", "Cotton"]}
        colors={["#B0B0B0", "#333333", "#E5E5E5"]}
        images={[image1, image2]}
      />
      <Inspiration />
      <Footer />
    </main>
  );
}
