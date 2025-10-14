import type { Item } from "@/routes/POS/POS";
import React, { createContext, useContext, useReducer, useState } from "react";

type Props = {
  children?: React.ReactNode;
};

type StoreContextType = {
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  scannedItems: {
    item: Item;
    qty: number;
  }[];
  scannedItemsDispatch: React.ActionDispatch<
    [
      action: {
        type: scannedItemsActions;
        payload: Item;
      }
    ]
  >;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

type scannedItemsActions = "ADD" | "REMOVE";
function scannedItemsReducer(
  state: { item: Item; qty: number }[],
  action: { type: scannedItemsActions; payload: Item }
) {
  switch (action.type) {
    case "ADD":
      let exists = false;
      let newState = state.map((item) => {
        if (item.item.id === action.payload.id) {
          exists = true;
          return { ...item, qty: item.qty + 1 };
        } else {
          return item;
        }
      });

      if (!exists) {
        newState.push({ item: action.payload, qty: 1 });
      }

      return newState;

    case "REMOVE":
      return state.map((item) => {
        if (item.item.id === action.payload.id && item.qty > 1) {
          return { ...item, qty: item.qty - 1 };
        } else {
          return item;
        }
      });
    default:
      return state;
  }
}

export default function StoreProvider({ children }: Props) {
  const [total, setTotal] = useState(0);
  const [scannedItems, scannedItemsDispatch] = useReducer(
    scannedItemsReducer,
    []
  );

  return (
    <StoreContext.Provider
      value={{ total, setTotal, scannedItems, scannedItemsDispatch }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
