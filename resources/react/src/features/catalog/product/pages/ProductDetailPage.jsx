import { useParams } from "react-router-dom";
import { ProductDetailClient } from "@/features/catalog/product/components/ProductDetailClient";

export default function ProductDetailPage() {
  const { slug } = useParams();
  return <ProductDetailClient slug={slug} />;
}
