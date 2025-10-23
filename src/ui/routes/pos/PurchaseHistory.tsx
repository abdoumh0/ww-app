import { useStore } from "@/lib/StoreContext";
import { useEffect } from "react";
import type {
  ItemAttributes,
  PurchaseAttributes,
} from "../../../electron/database";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {};

export default function PurchaseHistory({}: Props) {
  const { purchaseHistory, purchaseHistoryDispatch } = useStore();
  async function getHistory(get: number, skip: number) {
    const history = await window.electronAPI.invoke("purchase:get", {
      get,
      skip,
    });
    purchaseHistoryDispatch({ type: "ADD", payload: history });
  }
  useEffect(() => {
    getHistory(10, 0);
  }, []);

  return (
    <div className="flex flex-col w-64 bg-accent p-1 ml-1 mt-1 mb-1 relative">
      <span className="text-xs rounded-sm border border-border py-0.5 px-1.5 text-stone-500 bg-background/70 w- h-fit">
        Purchase history
      </span>
      {purchaseHistory.length === 0 && (
        <div className="mx-auto w-fit opacity-15">no purchases yet</div>
      )}
      {purchaseHistory.map((purchase) => {
        return <PurchaseHistoryItem key={purchase.id} {...purchase} />;
      })}
    </div>
  );
}

function PurchaseHistoryItem({
  id,
  total,
  items,
  createdAt,
}: PurchaseAttributes) {
  const parsedItems = JSON.parse(items) as {
    attributes: ItemAttributes;
    qty: number;
  }[];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="my-1 bg-background px-2 rounded-2xl text-sm py-1 cursor-pointer hover:underline underline-offset-2">
          <span className="flex justify-between px-0.5">
            <span className="font-bold">#{id}</span>
            <span>{total} DZD</span>
          </span>
          <span className="text-xs"></span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase #{id}</DialogTitle>
          <div className="max-h-56 overflow-y-scroll relative">
            {parsedItems.map((item) => {
              return (
                <span
                  key={item.attributes.id}
                  className="flex justify-between w-full"
                >
                  <span>{item.attributes.name}</span>
                  <span>{item.attributes.price}</span>
                  <span>{item.qty}</span>
                  <span>{item.attributes.price * item.qty}</span>
                </span>
              );
            })}
          </div>
        </DialogHeader>
        <DialogFooter>
          <span className="text-sm">{createdAt?.toLocaleString()}</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
