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

export type AccountInfo = {
  AccountID: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Type: string;
  Username: string | null;
  FacebookID: string | null;
  GoogleID: string | null;
  WorkArea: JsonValue;
  WorkAreaIDs: number[];
};
