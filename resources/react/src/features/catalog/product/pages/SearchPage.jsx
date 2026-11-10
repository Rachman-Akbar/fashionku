import { Suspense } from "react";
import SearchClient from "@/features/catalog/product/components/SearchClient";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchClient />
    </Suspense>
  );
}
