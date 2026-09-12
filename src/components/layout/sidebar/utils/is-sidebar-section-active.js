export function isSidebarSectionActive(children = [], pathname = "") {
  return children.some((child) => {
    if (!child.path) {
      return false;
    }

    return pathname === child.path || pathname.startsWith(`${child.path}/`);
  });
}
