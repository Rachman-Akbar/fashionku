export function isInactiveRow(row) {
  return row?.is_active === false || row?.isActive === false;
}
