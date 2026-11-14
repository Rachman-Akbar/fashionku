import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategoryHref,
  useCategoryNavigation,
} from "@/features/catalog/category/services/categoryService";
import {
  VOUCHER_GROUP,
  VOUCHER_GROUP_KEY,
} from "@/features/order/voucher/constants/voucherNavigation";
import { useActiveVouchers } from "@/features/order/voucher/services/voucherService";
import VoucherDropdownPage from "@/features/order/voucher/components/VoucherDropdown";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { Skeleton } from "@/shared/components/feedback/Skeleton";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

export function CategoryDropdown({
  open,
  onClose = () => {},
  selectedGroupKey = "",
}) {
  const dropdownRef = useRef(null);
  const [rendered, setRendered] = useState(open);
  const [activeGroup, setActiveGroup] = useState(VOUCHER_GROUP_KEY);
  const navigationQuery = useCategoryNavigation({ enabled: open || rendered });
  const groups = navigationQuery.data?.groups || [];
  const categoriesByGroup = navigationQuery.data?.categoriesByGroup || {};
  const activeGroupKey = String(activeGroup || "");
  const isVoucherActive = activeGroupKey === VOUCHER_GROUP_KEY;
  const vouchersQuery = useActiveVouchers({ enabled: open && isVoucherActive });
  const vouchers = vouchersQuery.data || [];
  const loading = navigationQuery.isLoading;
  const error = navigationQuery.error?.message || "";
  const voucherLoading = vouchersQuery.isLoading;
  const voucherError = vouchersQuery.error?.message || "";

  const rootCategories = useMemo(() => {
    const allGroup = categoriesByGroup.all || [];
    return Array.isArray(allGroup) ? allGroup : [];
  }, [categoriesByGroup]);

  const navGroups = useMemo(() => [VOUCHER_GROUP, ...rootCategories], [rootCategories]);

  const handleSetActiveGroup = useCallback(
    (groupKey) => {
      const nextKey = String(groupKey || "");
      if (!nextKey || nextKey === activeGroupKey) return;
      setActiveGroup(nextKey);
    },
    [activeGroupKey],
  );
  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (open) {
      setRendered(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setRendered(false), 720);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const requested = String(selectedGroupKey || "");
    const requestedExists =
      requested &&
      navGroups.some(
        (group) => String(group.key ?? group.id ?? group.slug) === requested,
      );
    const activeStillExists = navGroups.some(
      (group) =>
        String(group.key ?? group.id ?? group.slug) === activeGroupKey,
    );
    const nextGroup = requestedExists ? requested : VOUCHER_GROUP_KEY;

    if (!activeStillExists || (requestedExists && requested !== activeGroupKey)) {
      setActiveGroup(nextGroup);
    }
  }, [activeGroupKey, navGroups, open, selectedGroupKey]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, open]);

  if (!rendered) return null;

  const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Cpath d='M180 385h240l-74-94-54 68-42-52-70 78Z' fill='%23d1d5db'/%3E%3Ccircle cx='235' cy='235' r='35' fill='%23d1d5db'/%3E%3C/svg%3E";

  return (
    <>
      <div
        className={`absolute left-0 right-0 top-full z-40 h-screen bg-black/45 backdrop-blur-[1px] transition-opacity duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleClose();
        }}
      />

      <div
        ref={dropdownRef}
        className={`absolute left-0 right-0 top-full z-50 overflow-hidden border-t border-gray-200 bg-white font-sans transition-[max-height,opacity,transform,filter] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ${
          open
            ? "max-h-[560px] translate-y-0 opacity-100 blur-0 delay-[80ms]"
            : "pointer-events-none max-h-0 -translate-y-6 opacity-0 blur-[1px] delay-0"
        }`}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="border-b border-gray-200 bg-white px-4">
          <div className="mx-auto flex max-w-[1200px] items-center gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navGroups.map((group) => {
              const groupKey = String(group.key ?? group.id ?? group.slug);
              const isActive = activeGroupKey === groupKey;

              return (
                <button
                  key={groupKey}
                  type="button"
                  onMouseEnter={() => handleSetActiveGroup(groupKey)}
                  onClick={() => handleSetActiveGroup(groupKey)}
                  className={`whitespace-nowrap border-b-4 px-5 py-3 text-sm font-bold transition-[border-color,color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "border-[#10B981] bg-white text-[#10B981]"
                      : "border-transparent bg-white text-gray-500 hover:text-[#10B981]"
                  }`}
                >
                  {toTitleCase(group.name)}
                </button>
              );
            })}
          </div>
        </div>

        {isVoucherActive ? (
          <VoucherDropdownPage
            vouchers={vouchers}
            loading={voucherLoading}
            error={voucherError}
          />
        ) : (
          <div className="mx-auto max-h-[460px] max-w-[1200px] overflow-y-auto overscroll-contain bg-white p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {loading && (
              <div className="flex max-w-md flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-60" />
              </div>
            )}

            {error && (
              <div className="px-4 py-2 text-xs text-red-500">{error}</div>
            )}

            {!loading && !error && !rootCategories.length && (
              <div className="py-2 text-sm text-gray-400">
                Kategori belum tersedia
              </div>
            )}

            {!loading && !error && rootCategories.length > 0 && (
              <div className="space-y-8">
                {rootCategories.map((levelOne) => {
                  const levelTwoChildren = Array.isArray(levelOne.children) ? levelOne.children : [];
                  if (!levelTwoChildren.length) return null;

                  const isActive = activeGroupKey === String(levelOne.key ?? levelOne.id ?? levelOne.slug);
                  if (!isActive) return null;

                  return (
                    <div
                      key={levelOne.key || levelOne.id || levelOne.slug}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {levelTwoChildren.map((levelTwo) => {
                          const levelThreeChildren = Array.isArray(levelTwo.children) ? levelTwo.children : [];

                          return (
                            <div
                              key={levelTwo.key || levelTwo.id || levelTwo.slug}
                              className="space-y-2"
                            >
                              <Link
                                to={getCategoryHref(levelTwo)}
                                onClick={handleClose}
                                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#10B981]"
                              >
                                {levelTwo.image_url && (
                                  <img
                                    src={resolveMediaUrl(levelTwo.image_url)}
                                    alt=""
                                    className="h-4 w-4 flex-shrink-0 rounded object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.src = placeholderSvg;
                                    }}
                                  />
                                )}
                                {levelTwo.name}
                              </Link>

                              {levelThreeChildren.length > 0 && (
                                <ul className="space-y-1.5 pl-2">
                                  {levelThreeChildren.map((levelThree) => (
                                    <li
                                      key={
                                        levelThree.key ||
                                        levelThree.id ||
                                        levelThree.slug
                                      }
                                    >
                                      <Link
                                        to={getCategoryHref(levelThree)}
                                        onClick={handleClose}
                                        className="flex items-center gap-1.5 text-xs text-gray-500 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#10B981]"
                                      >
                                        {levelThree.image_url && (
                                          <img
                                            src={resolveMediaUrl(levelThree.image_url)}
                                            alt=""
                                            className="h-3 w-3 flex-shrink-0 rounded object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                              e.currentTarget.src = placeholderSvg;
                                            }}
                                          />
                                        )}
                                        {levelThree.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}