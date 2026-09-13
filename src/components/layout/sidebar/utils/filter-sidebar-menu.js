export function filterSidebarMenu(
  menu,
  permissions = [],
  isPlatformAdmin = false,
) {
  const permissionSet = new Set(permissions);

  return menu
    .filter((item) => {
      if (item.access === "platform-admin") {
        return isPlatformAdmin;
      }

      if (!item.permission) {
        return true;
      }

      return permissionSet.has(item.permission);
    })
    .map((item) => {
      if (!item.children) {
        return item;
      }

      const children = filterSidebarMenu(
        item.children,
        permissions,
        isPlatformAdmin,
      );

      if (item.access === "platform-admin" && children.length === 0) {
        return null;
      }

      return {
        ...item,
        children,
      };
    })
    .filter(Boolean);
}
