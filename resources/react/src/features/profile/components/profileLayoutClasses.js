export const profileLayout = {
  page: "flex h-full min-w-0 max-w-full flex-1 overflow-hidden bg-white",
  rail: "hidden h-[100dvh] w-16 shrink-0 flex-col items-center justify-between border-r border-[#e5e7eb] bg-white py-4 md:flex",
  mobileNav: "fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-[#e5e7eb] bg-white px-2 md:hidden",
  sidebar:
    "flex h-full w-full shrink-0 flex-col border-r border-[#e5e7eb] bg-white sm:w-[320px] lg:w-[360px]",
  sidebarHeader:
    "flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb] px-4",
  sidebarTitle: "text-xl font-bold leading-none text-slate-950",
  sidebarSearch: "shrink-0 border-b border-[#e5e7eb] px-3 py-3",
  filterRow:
    "flex h-12 shrink-0 items-center gap-2 overflow-x-auto border-b border-[#e5e7eb] px-3 text-xs",
  listScroll: "min-h-0 flex-1 overflow-y-auto",
  listItem:
    "grid min-h-[76px] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-4 py-3 text-left transition",
  listDivider: "col-span-3 mt-3 border-[#e5e7eb]",
  chatPanel: "flex h-full min-w-0 max-w-full flex-1 flex-col overflow-hidden bg-[#efeae2]",
  chatHeader:
    "flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 shadow-sm",
  chatBody: "relative min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 md:px-8",
  chatFooter:
    "flex h-16 shrink-0 items-center gap-3 border-t border-[#e5e7eb] bg-white px-4",
  contentShell: "h-full min-w-0 max-w-full flex-1 overflow-y-auto overflow-x-hidden bg-white",
  contentInner: "mx-auto w-full min-w-0 max-w-[960px] px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10",
  contentHeader:
    "mb-8 flex min-h-[104px] flex-col justify-end gap-4 sm:flex-row sm:items-end sm:justify-between",
  contentTitle: "text-3xl font-light leading-tight text-slate-950",
  contentEyebrow:
    "text-xs font-semibold uppercase tracking-[0.18em] text-[#10B981]",
  contentDesc: "max-w-2xl text-sm leading-6 text-slate-500",
  divider: "border-[#e5e7eb]",
  searchBox:
    "flex h-11 items-center rounded-lg bg-white px-3 text-slate-400 ring-1 ring-[#e5e7eb] focus-within:ring-[#10B981]",
  primaryButton:
    "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#10B981] px-5 text-sm font-semibold text-white transition hover:bg-[#059669]",
  secondaryButton:
    "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#e5e7eb] px-5 text-sm font-semibold text-slate-600 transition hover:border-[#10B981] hover:text-[#10B981]",
};
