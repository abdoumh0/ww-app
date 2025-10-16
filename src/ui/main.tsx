import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import POS from "./routes/POS/POS.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "./layout.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import StoreProvider from "./lib/StoreContext.tsx";
import "@fontsource/dseg7-classic/700.css";
import Inventory from "./routes/Inventory/Inventory.tsx";
import AuthPage from "./routes/Auth/AuthPage.tsx";
import { SessionProvider } from "./lib/SessionContext.tsx";

export default App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SessionProvider>
        <StoreProvider>
          <SidebarProvider>
            <HashRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<App />} />
                  <Route path="pos" element={<POS />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="auth" element={<AuthPage />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </HashRouter>
          </SidebarProvider>
        </StoreProvider>
      </SessionProvider>
    </ThemeProvider>
  </StrictMode>
);
