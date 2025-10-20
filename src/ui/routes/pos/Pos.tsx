import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/StoreContext";
import { useEffect, useRef, useState } from "react";
import type { ItemAttributes } from "../../../electron/database";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import PurchaseHistory from "./PurchaseHistory";
import ItemList from "./ItemList";
import Calc from "./Calc";

type Props = {};

export interface Item {
  id: string;
  code: string;
  name: string;
  price: number;
  imagePath?: string;
  type?: string;
  variant?: string;
}

export default function POS({}: Props) {
  const { scannedItems, scannedItemsDispatch, purchaseHistoryDispatch } =
    useStore();
  return (
    <div className="flex flex-1 h-full">
      <PurchaseHistory />
      <div className="flex flex-col flex-1 h-full relative">
        <ItemSearch />
        <div className="px-1.5 m-1">
          <div className="mb-2 font-mono text-stone-400">Total (DZD):</div>
          <div className="font-DSEG text-green-700 text-6xl">
            {scannedItems.reduce((sum, item) => {
              return sum + item.qty * item.attributes.price;
            }, 0)}
          </div>
        </div>
        <ItemList />
      </div>
      <div className="flex flex-col mx-1">
        <Calc />
        <div className="flex-1 flex flex-col justify-evenly">
          <Button
            onClick={async () => {
              if (scannedItems.length > 0) {
                const purchase = await window.electronAPI.invoke(
                  "purchase:create",
                  scannedItems
                );
                if (purchase) {
                  purchaseHistoryDispatch({ type: "ADD", payload: [purchase] });
                  scannedItemsDispatch({
                    type: "NUKE",
                    payload: scannedItems.at(0)!.attributes, //doesnt matter if undefined, payload is unused on NUKE
                  });
                  return;
                }
                toast("something went wrong");
              }
            }}
            className="border border-border bg-accent h-20 text-white hover:bg-green-600"
          >
            Complete <Check />
          </Button>
          <Button
            onClick={() =>
              scannedItemsDispatch({
                type: "NUKE",
                payload: scannedItems.at(0)!.attributes,
              })
            }
            className="h-12 border border-border bg-background text-white hover:bg-red-400"
          >
            Cancel <X />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ItemSearch() {
  const [items, setItems] = useState<ItemAttributes[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const { scannedItemsDispatch } = useStore();

  useEffect(() => {
    if (items.length === 0) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [items]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false); // clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="m-1 relative w-[95%] mx-auto ">
      <Input
        placeholder="Search"
        className="w-full px-1.5 rounded-sm"
        onFocus={() => setIsOpen(true)}
        onChange={async (e) => {
          if (e.currentTarget.value.length === 0) {
            setItems([]);
            return;
          }
          const items = await window.electronAPI.invoke("item:get_by_name", {
            name: e.currentTarget.value,
          });
          setItems(items);
        }}
      ></Input>
      <div className="z-50 absolute w-full max-h-56 h-fit overflow-y-scroll bg-background mt-1.5 border-background border rounded-sm ">
        {isOpen &&
          items.map((item) => {
            return (
              <div
                onClick={() => {
                  scannedItemsDispatch({ type: "ADD", payload: item });
                  setIsOpen(false);
                }}
                key={item.id}
                className="p-2 cursor-pointer hover:brightness-105 active:brightness-95 my-0.5 bg-accent"
              >
                {item.name} - {item.price}
              </div>
            );
          })}
      </div>
    </div>
  );
}
