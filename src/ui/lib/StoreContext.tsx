import React, { createContext, useContext, useReducer } from "react";
import type {
  ItemAttributes,
  PurchaseAttributes,
} from "../../electron/database";
import { sortBy, uniqBy } from "lodash";
import type { UserItem } from "@/routes/Users/User";

type Props = {
  children?: React.ReactNode;
};

type StoreContextType = {
  scannedItems: {
    attributes: ItemAttributes;
    qty: number;
  }[];
  scannedItemsDispatch: React.ActionDispatch<
    [
      action: {
        type: scannedItemsActions;
        payload: ItemAttributes;
      }
    ]
  >;
  purchaseHistory: PurchaseAttributes[];
  purchaseHistoryDispatch: React.ActionDispatch<
    [
      action: {
        type: purchaseHistoryActions;
        payload: PurchaseAttributes[];
      }
    ]
  >;
  cart: Cart;
  cartDispatch: React.ActionDispatch<
    [
      action: {
        type: cartActions;
        payload: { owner: string; item?: UserItem };
      }
    ]
  >;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ids for unnamed additions, negative to avoid collision with db item ids
let unnamedItemID = -1;

type scannedItemsActions = "ADD" | "DECREMENT" | "REMOVE" | "NUKE";
function scannedItemsReducer(
  state: { attributes: ItemAttributes; qty: number }[],
  action: { type: scannedItemsActions; payload: ItemAttributes }
): { attributes: ItemAttributes; qty: number }[] {
  switch (action.type) {
    case "ADD":
      if (action.payload.code === "") {
        const newState = [
          ...state,
          { qty: 1, attributes: { ...action.payload, id: unnamedItemID } },
        ];
        unnamedItemID -= 1;
        return newState;
      }
      let exists = false;
      let newState = state.map((item) => {
        if (item.attributes.id === action.payload.id) {
          exists = true;
          return { ...item, qty: item.qty + 1 };
        } else {
          return item;
        }
      });

      if (!exists) {
        newState.push({ attributes: action.payload, qty: 1 });
      }

      return newState;

    case "DECREMENT":
      const item = state.find(
        (item) => item.attributes.id === action.payload.id
      );
      if (!item || item.qty < 1) {
        return state;
      }
      if (item.qty === 1) {
        //recursive cus i like it
        return scannedItemsReducer(state, {
          type: "REMOVE",
          payload: action.payload,
        });
      }

      return state.map((item) => {
        if (item.attributes.id === action.payload.id) {
          return { ...item, qty: item.qty - 1 };
        } else {
          return item;
        }
      });

    case "REMOVE":
      return state.filter((item) => item.attributes.id != action.payload.id);

    case "NUKE":
      unnamedItemID = -1;
      return [];
    default:
      return state;
  }
}

type purchaseHistoryActions = "ADD";
function purchaseHistoryReducer(
  state: PurchaseAttributes[],
  action: { type: purchaseHistoryActions; payload: PurchaseAttributes[] }
): PurchaseAttributes[] {
  switch (action.type) {
    case "ADD":
      const newState = [...state, ...action.payload];
      const sortedASC = sortBy(newState, (purchase) => purchase.createdAt);
      const sortedDESC = sortedASC.reverse();
      return uniqBy(sortedDESC, "id");

    default:
      return state;
  }
}
type Cart = Map<string, { attributes: UserItem; qty: number }[]>;
type cartActions = "ADD_TO_CART" | "REMOVE_FROM_CART" | "CLEAR_CART";
function CartReducer(
  state: Cart,
  action: {
    type: cartActions;
    payload: { owner: string; item?: UserItem };
  }
) {
  switch (action.type) {
    case "ADD_TO_CART":
      if (!action.payload.item) {
        return state;
      }
      const { ItemID } = action.payload.item.Items;
      if (!ItemID) return state;
      let newState = new Map(state);
      let cart = newState.get(action.payload.owner);
      if (!cart) {
        newState.set(action.payload.owner, [
          { attributes: action.payload.item, qty: 1 },
        ]);
        return newState;
      }
      let exists = false;
      cart.forEach((i) => {
        if (i.attributes.Items.ItemID === ItemID) {
          i.qty += 1;
          exists = true;
        }
      });
      if (!exists) {
        cart.push({ attributes: action.payload.item, qty: 1 });
      }
      newState.set(action.payload.owner, cart);
      return newState;

    case "REMOVE_FROM_CART":
      if (!action.payload.item) {
        return state;
      }
      let newState_ = new Map(state);
      let cart2 = newState_.get(action.payload.owner);
      if (!cart2) return newState_;
      let item = cart2.find(
        (i) => i.attributes.Items.ItemID === action.payload.item!.Items.ItemID
      );
      if (item) {
        if (item.qty > 1) {
          console.log("sec");
          item.qty -= 1;
          newState_.set(action.payload.owner, cart2);
        } else {
          const filtered = cart2.filter(
            (i) =>
              i.attributes.Items.ItemID !== action.payload.item!.Items.ItemID
          );
          newState_.set(action.payload.owner, filtered);
        }
      }
      return newState_;
    case "CLEAR_CART":
      let clearedState = new Map(state);
      clearedState.delete(action.payload.owner);
      return clearedState;
    default:
      return state;
  }
}

export default function StoreProvider({ children }: Props) {
  const [scannedItems, scannedItemsDispatch] = useReducer(
    scannedItemsReducer,
    []
  );

  const [purchaseHistory, purchaseHistoryDispatch] = useReducer(
    purchaseHistoryReducer,
    []
  );

  const [cart, cartDispatch] = useReducer(
    CartReducer,
    new Map<string, { attributes: UserItem; qty: number }[]>()
  );

  return (
    <StoreContext.Provider
      value={{
        scannedItems,
        scannedItemsDispatch,
        purchaseHistory,
        purchaseHistoryDispatch,
        cart,
        cartDispatch,
      }}
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
