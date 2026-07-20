import type { NavigationItem } from "./navigation-types";

export function flattenNavigation(
  items: readonly NavigationItem[]
): NavigationItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children
      ? flattenNavigation(item.children)
      : []),
  ]);
}

export function findNavigationItem(
  pathname: string,
  items: readonly NavigationItem[]
) {
  return flattenNavigation(items).find(
    (item) => item.href !== undefined && pathname.startsWith(item.href)
  );
}

export function generateBreadcrumbs(
  pathname: string,
  items: readonly NavigationItem[]
) {
  const current = findNavigationItem(
    pathname,
    items
  );

  if (!current) return [];

  return [
    {
      title: current.title,
      href: current.href,
    },
  ];
}

export function getActiveNavigation(
  pathname: string,
  items: readonly NavigationItem[]
) {
  return findNavigationItem(pathname, items);
}

export function getNavigationByPermission(
  items: readonly NavigationItem[],
  permissions: readonly string[]
) {
  return items.filter((item) =>
    permissions.includes(item.permission)
  );
}