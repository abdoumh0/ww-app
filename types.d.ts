import { InvokeFn, OnFn } from "./src/electron/api-contract";

declare global {
  interface Window {
    electronAPI: {
      invoke: InvokeFn;
      on: OnFn;
    };
    env: {
      WEBAPP_DOMAIN: string;
    };
  }
}

declare module "*.css";
declare module "@fontsource/*" {}
declare module "@fontsource-variable/*" {}

export {};
