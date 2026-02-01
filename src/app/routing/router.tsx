import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { PageLoader } from "@/shared/ui/PageLoader";

const Search = lazy(() => import("@/pages/Search").then((m) => ({ default: m.Search })));
const Bookmarks = lazy(() =>
  import("@/pages/Bookmarks").then((m) => ({ default: m.Bookmarks }))
);
const CargoDetail = lazy(() =>
  import("@/pages/CargoDetail").then((m) => ({ default: m.CargoDetail }))
);
const Add = lazy(() => import("@/pages/Add").then((m) => ({ default: m.Add })));
const Notifications = lazy(() =>
  import("@/pages/Notifications").then((m) => ({ default: m.Notifications }))
);
const Applications = lazy(() =>
  import("@/pages/Applications").then((m) => ({ default: m.Applications }))
);
const Welcome = lazy(() =>
  import("@/pages/Welcome").then((m) => ({ default: m.Welcome }))
);
const Install = lazy(() =>
  import("@/pages/Install").then((m) => ({ default: m.Install }))
);

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: withSuspense(<Search />),
      },
      {
        path: "/bookmarks",
        element: withSuspense(<Bookmarks />),
      },
      {
        path: "/cargo/:id",
        element: withSuspense(<CargoDetail />),
      },
      {
        path: "/add",
        element: withSuspense(<Add />),
      },
      {
        path: "/notifications",
        element: withSuspense(<Notifications />),
      },
      {
        path: "/applications",
        element: withSuspense(<Applications />),
      },
    ],
  },
  {
    path: "/:id/:lang/",
    element: withSuspense(<Welcome />),
  },
  {
    path: "/install",
    element: withSuspense(<Install />),
  },
]);
