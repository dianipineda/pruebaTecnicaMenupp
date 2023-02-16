const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout"),

    children: [
      {
        path: "/",
        component: () => import("pages/HomePage"),
        name: "HomePage",
      },
      {
        path: "/",
        component: () => import("pages/HomePage"),
        name: "AccessApp",
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound"),
  },
];

export default routes;
