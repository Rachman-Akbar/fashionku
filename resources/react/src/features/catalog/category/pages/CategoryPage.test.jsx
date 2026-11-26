import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/features/catalog/category/services/categoryService", () => ({
  getCategoryByPath: vi.fn(async () => ({
    id: 1,
    name: "Pakaian",
    slug: "pakaian",
    level: 1,
    image_url: "http://cdn.test/pakaian.jpg",
    icon_url: null,
    children: [
      {
        id: 2,
        name: "Pakaian Pria",
        slug: "pakaian-pria",
        level: 2,
        image_url: "http://cdn.test/pakaian-pria.jpg",
        icon_url: null,
        children: [],
      },
    ],
  })),
  getCategoryHref: (category) => `/category/${category.slug}`,
  useInfiniteProductsByCategoryPath: () => ({
    data: { pages: [{ data: [], raw: {} }] },
    isLoading: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
  }),
}));

import CategoryPage from "@/features/catalog/category/pages/CategoryPage";

describe("CategoryPage images", () => {
  it("renders child category images on a root category page", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/category/pakaian"]}>
          <Routes>
            <Route path="/category/*" element={<CategoryPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const currentImage = await screen.findByAltText("Pakaian");
    expect(currentImage.getAttribute("src")).toBe("http://cdn.test/pakaian.jpg");

    const childImage = screen.getByAltText("Pakaian Pria");
    expect(childImage.getAttribute("src")).toBe("http://cdn.test/pakaian-pria.jpg");
  });
});
