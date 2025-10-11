import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="p-6 h-[2000px]">
        <p>Test Scrollable navigation bar</p>
      </div>
      <Footer />
    </main>
  );
}
