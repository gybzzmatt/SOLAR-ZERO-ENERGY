import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Home ("/") gets a per-page-load restoration key, so a reload never finds a
  // saved position and starts at the top (or at the #hash anchor). Other routes
  // keep the default href-based key and restore normally.
  const homeLoadId = Math.random().toString(36).slice(2);

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    getScrollRestorationKey: (location) =>
      location.pathname === "/" ? `${location.href}::load-${homeLoadId}` : location.href,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
