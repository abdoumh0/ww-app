import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Pos from "./routes/pos/Pos.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "./layout.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";

export default App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<App />} />
              <Route path="pos" element={<Pos />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </SidebarProvider>
    </ThemeProvider>
  </StrictMode>
);
