import { lazy } from "react";
import { RouteObject } from "react-router-dom";

import { AdminGuard } from "@/auth/guard/adminGuard";
import Users from "@/pages/Protected/Users";

// Clip Spin routes
const ClipSpinLayout = lazy(() => import("@/layout/ClipSpinLayout"));
const Requests = lazy(() => import("@/pages/dashboard/Requests"));

export const dashboard: RouteObject[] = [
  {
    path: "/",
    element: <ClipSpinLayout />,
    children: [
      {
        path: "requests",
        element: <Requests />,
      },
      {
        path: "/",
        element: (
          <AdminGuard>
            <Users />
          </AdminGuard>
        ),
      },
    ],
  },
];
