import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import "./index.css";
import HeaderComponent from "./components/HeaderComponent.jsx";

import ArchievesPage from "./pages/ArchievesPage.jsx";
import BacklogsPage from "./pages/BacklogsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import RoomsPage from "./pages/RoomsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import NavBarComponent from "./components/navigation/NavBarComponent.jsx";
import Root from "./pages/Root.jsx";
import RoomsAdd from "./components/rooms/RoomsAdd";

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
        path: "rooms_edit",
        element: <RoomsEdit />,
      },
      {
        path: "rooms_description",
        element: <RoomsDescription />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </StrictMode>
);
