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

  const navGroups = useMemo(() => [VOUCHER_GROUP, ...groups], [groups]);
  const l1List = useMemo(() => {
    if (isVoucherActive) return [];
    const list =
      categoriesByGroup[activeGroupKey] ??
      categoriesByGroup[Number(activeGroupKey)] ??
      [];
    return Array.isArray(list) ? list : [];
  }, [activeGroupKey, categoriesByGroup, isVoucherActive]);

  const levelTwoList = useMemo(() => {
    return (l1List || []).flatMap((l1) =>
      Array.isArray(l1.children) ? l1.children : []
    );
  }, [l1List]);

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

            {!loading && !error && !levelTwoList.length && (
              <div className="py-2 text-sm text-gray-400">
                Kategori belum tersedia
              </div>
            )}

            {!loading && !error && levelTwoList.length > 0 && (
              <div className="columns-2 gap-8 space-y-7 md:columns-3 xl:columns-4">
                {levelTwoList.map((levelTwo) => (
                  <div
                    key={levelTwo.key || levelTwo.id || levelTwo.slug}
                    className="break-inside-avoid"
                  >
                    <Link
                      to={getCategoryHref(levelTwo)}
                      onClick={handleClose}
                      className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#10B981]"
                    >
                      {levelTwo.image_url && (
                        <img
                          src={levelTwo.image_url}
                          alt=""
                          className="h-5 w-5 flex-shrink-0 rounded object-cover"
                          loading="lazy"
                        />
                      )}
                      {levelTwo.name}
                    </Link>

                    {Array.isArray(levelTwo.children) &&
                    levelTwo.children.length ? (
                      <ul className="space-y-1.5">
                        {levelTwo.children.map((levelThree) => (
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
                                  src={levelThree.image_url}
                                  alt=""
                                  className="h-4 w-4 flex-shrink-0 rounded object-cover"
                                  loading="lazy"
                                />
                              )}
                              {levelThree.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
