import { type PurchaseAttributes, type ItemAttributes } from "./database.js";

export interface APIChannels {
  "purchase:create": {
    input: { attributes: ItemAttributes; qty: number }[];
    output: PurchaseAttributes | null;
  };
  "purchase:get": {
    input: { get: number; skip: number };
    output: PurchaseAttributes[];
  };
  "item:create": {
    input: {
      code: string;
      name: string;
      price: number;
      imagePath?: string;
      type?: string;
      variant?: string;
    };
    output: ItemAttributes;
  };

  "item:list": {
    input: { skip: number; perPage: number };
    output: Array<ItemAttributes>;
  };

  "item:get_by_code": {
    input: { code: string };
    output: ItemAttributes | null;
  };

  "item:get_by_name": {
    input: { name: string };
    output: ItemAttributes[];
  };

  "item:update": {
    input: ItemAttributes;
    output: ItemAttributes;
  };

  "item:delete": {
    input: { id: string };
    output: { success: boolean };
  };
}

export interface EventChannels {
  "notification:new": {
    title: string;
    message: string;
    type: string;
  };
}

export type ChannelName = keyof APIChannels;
export type EventChannelName = keyof EventChannels;

export type InvokeFn = <K extends ChannelName>(
  channel: K,
  ...args: APIChannels[K]["input"] extends void
    ? []
    : [data: APIChannels[K]["input"]]
) => Promise<APIChannels[K]["output"]>;

export type OnFn = <K extends EventChannelName>(
  channel: K,
  callback: (data: EventChannels[K]) => void
) => () => void;

export type SendFn = <K extends EventChannelName>(
  channel: K,
  data: EventChannels[K]
) => void;
