export interface APIChannels {
  "purchase:create": {
    input: { name: string; items: string[] };
    output: { success: boolean; name: string; items: string[] };
  };
  "item:create": {
    input: {
      code: number;
      name: string;
      price: number;
      imagePath?: string;
      type?: string;
      variant?: string;
    };
    output: {
      id: string;
      code: number;
      name: string;
      price: number;
      imagePath?: string;
      type?: string;
      variant?: string;
      createdAt: string;
    };
  };

  "item:list": {
    input: void;
    output: Array<{
      id: string;
      code: number;
      name: string;
      price: number;
      imagePath?: string;
      type?: string;
      variant?: string;
    }>;
  };

  "item:get": {
    input: { id: string };
    output: {
      id: string;
      code: number;
      name: string;
      price: number;
      imagePath?: string;
      type?: string;
      variant?: string;
    } | null;
  };

  "item:update": {
    input: {
      id: string;
      code?: number;
      name?: string;
      price?: number;
      imagePath?: string;
      type?: string;
      variant?: string;
    };
    output: {
      id: string;
      code: number;
      name: string;
      price: number;
      imagePath?: string;
      type?: string;
      variant?: string;
      updatedAt: string;
    };
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
