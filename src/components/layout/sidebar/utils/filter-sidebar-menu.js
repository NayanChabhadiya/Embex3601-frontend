export function filterSidebarMenu(menu, permissions = []) {
  const permissionSet = new Set(permissions);

  return menu.filter((item) => {
    if (!item.permission) {
      return true;
    }

    return permissionSet.has(item.permission);
  });
}
