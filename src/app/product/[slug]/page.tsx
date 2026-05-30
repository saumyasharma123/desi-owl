import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailContent } from "@/components/product/ProductDetailContent";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <ProductDetailContent slug={slug} />
      </main>
      <Footer />
    </div>
  );
}
