import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Docs from "./pages/docs/Docs.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/d/*",
    element: <Docs />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
);
