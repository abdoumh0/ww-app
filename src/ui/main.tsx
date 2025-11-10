import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Layout from "./layout.tsx";
import "@fontsource/dseg7-classic/700.css";
import Inventory from "./routes/Inventory/Inventory.tsx";
import AuthPage from "./routes/Auth/AuthPage.tsx";
import POS from "./routes/pos/Pos.tsx";
import Messages from "./routes/Messages/Messages.tsx";
import User from "./routes/Users/User.tsx";
import Providers from "./Providers.tsx";
import Browse from "./routes/Browse/Browse.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<App />} />
            <Route path="pos" element={<POS />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="messages" element={<Messages />} />
            <Route path="users/:username" element={<User />} />
            <Route path="browse" element={<Browse />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </Providers>
  </StrictMode>
);
