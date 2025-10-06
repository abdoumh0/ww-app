import { InvokeFn, OnFn } from "./src/electron/api-contract";

declare global {
  interface Window {
    electronAPI: {
      invoke: InvokeFn;
      on: OnFn;
    };
  }
}

export {};
