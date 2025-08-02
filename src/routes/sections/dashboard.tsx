import { lazy } from "react";
import { RouteObject } from "react-router-dom";

import { AdminGuard } from "@/auth/guard/adminGuard";
import { ProjectDetail } from "@/pages/dashboard";
import { RecentProjects } from "@/pages/dashboard/RecentProjects";
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
      {
        path: "projects/:userId",
        element: (
          <AdminGuard>
            <RecentProjects />
          </AdminGuard>
        ),
      },
      {
        path: "project/:projectId",
        element: <ProjectDetail />,
      },
    ],
  },
];
