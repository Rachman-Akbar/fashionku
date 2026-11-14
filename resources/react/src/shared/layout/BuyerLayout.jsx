import { memo } from "react";
import { Navbar } from "@/shared/layout/Navbar";
import { Footer } from "@/shared/layout/Footer";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";

const StableNavbar = memo(Navbar);
const StableFooter = memo(Footer);

export default function BuyerLayout() {
  return (
    <div className="min-h-screen max-w-full bg-white">
      <div className="flex min-h-screen max-w-full flex-col">
        <StableNavbar />
        <PageTransitionLoader />
        <main className="min-w-0 max-w-full flex-1">
          <RouteOutletBoundary className="min-h-full w-full max-w-full" />
        </main>
        <StableFooter />
      </div>
    </div>
  );
}
