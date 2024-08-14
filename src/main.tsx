import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ConfigProvider } from "./state";
import Docs from "./pages/docs/Docs";
import App from "./App.tsx";
import "./index.css";
import Home from "./pages/home/Home.tsx";

const router = createBrowserRouter([
  {
    path: "/d/*",
    element: <App content={<Docs />}  />,
  },
  {
    path: "/",
    element: <App content={<Home />} />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>
);
