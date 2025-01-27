import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import "./index.css";
import HeaderComponent from "./components/HeaderComponent.jsx";

import ArchievesPage from "./pages/archieves";
import BacklogsPage from "./pages/backlogs";
import DashboardPage from "./pages/dashboard";
import RoomsPage from "./pages/(rooms)/rooms";
import RoomsAdd from "./pages/(rooms)/roomsAdd";
import RoomsEdit from "./pages/(rooms)/roomsEdit";
import RoomsDescription from "./pages/(rooms)/roomsDescription";
import UsersPage from "./pages/(users)/users";
import UserAdd from "./pages/(users)/userAdd";
import UserEdit from "./pages/(users)/userEdit";
import UserSchedulePage from "./pages/userSchedule";
import Root from "./pages/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SchedulePage from "./pages/schedule";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },

      {
        path: "User Schedule",
        element: <UserSchedulePage />,
      },

      {
        path: "users",
        element: <UsersPage />,
      },

      {
        path: "user_add",
        element: <UserAdd />,
      },
      {
        path: "user_edit",
        element: <UserEdit />,
      },
      {
        path: "schedule",
        element: <SchedulePage />,
      },
      {
        path: "backlogs",
        element: <BacklogsPage />,
      },

      {
        path: "archieves",
        element: <ArchievesPage />,
      },
      {
        path: "rooms",
        element: <RoomsPage />,
      },
      {
        path: "rooms_add",
        element: <RoomsAdd />,
      },
      {
        path: "rooms_edit/:id",
        element: <RoomsEdit />,
      },
      {
        path: "rooms_description/:id",
        element: <RoomsDescription />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </QueryClientProvider>
  </StrictMode>
);
