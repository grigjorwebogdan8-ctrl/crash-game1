import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { MainApp } from "./MainApp";
import { AdminPanelRoute } from "./AdminPanelRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: MainApp },
      { path: "admin", Component: AdminPanelRoute },
    ],
  },
]);