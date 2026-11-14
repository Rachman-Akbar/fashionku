import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransitionLoader() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gradient-to-r from-[#10B981] to-[#059669] animate-pulse" role="progressbar" aria-valuemin={0} aria-valuemax={100} />
  );
}