import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/StoreContext";
import { Barcode, Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {};

export default function ItemList({}: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const [barcode, setBarcode] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { scannedItems, scannedItemsDispatch } = useStore();

  useEffect(() => {
    let buffer = "";
    let lastInputTime = 0;
    const SCAN_TIMEOUT = 30;
    const END_DELAY = 80;
    let scanTimer: number | undefined;

    const listener = (e: KeyboardEvent) => {
      const now = Date.now();
      const timeSinceLast = now - lastInputTime;

      if (timeSinceLast > SCAN_TIMEOUT) {
        console.log("too slow", e.key);
        // document.dispatchEvent(new KeyboardEvent("keydown", { ...e }));
        buffer = "";
      }

      lastInputTime = now;

      if (e.key.length === 1) {
        buffer += e.key;
      }

      if (scanTimer) {
        clearTimeout(scanTimer);
      }

      scanTimer = window.setTimeout(() => {
        if (buffer.length >= 6) {
          console.log("Scanned barcode:", buffer);
          setBarcode(buffer);
        }
        buffer = "";
      }, END_DELAY);
    };

    divRef.current?.addEventListener("keydown", listener);

    return () => {
      divRef.current?.removeEventListener("keydown", listener);
    };
  }, []);

  //useEffect to fetch and add the item to the list

  useEffect(() => {
    const getItem = async () => {
      if (barcode.length < 6) {
        //might aswell be == 0, but for consistency's sake (have to check otherwise triggers on mount)
        return;
      }
      const item = await window.electronAPI.invoke("item:get_by_code", {
        code: barcode,
      });
      if (!item) {
        toast(
          "item not found, try searching manually or add the item to the database"
        );
        //maybe provide a quick way to add the item from pos
        return;
      }

      scannedItemsDispatch({ type: "ADD", payload: item });
    };

    getItem();
  }, [barcode]);

  return (
    <div
      ref={divRef}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="focus:border border-border bg-accent flex-1 m-1"
    >
      {scannedItems.length == 0 && <EmptyList active={isFocused} />}
      {scannedItems.map((item) => {
        return (
          <div
            className="bg-stone-600 m-0.5 p-2.5 rounded-sm flex justify-between"
            key={item.attributes.id}
          >
            <span>{item.attributes.name}</span>
            <span>{item.attributes.price * item.qty} DZD</span>
            <span className="flex">
              <span className="mr-3">qty. {item.qty}</span>
              {item.attributes.id! >= 0 && (
                <>
                  <Button
                    onClick={() => {
                      scannedItemsDispatch({
                        type: "ADD",
                        payload: item.attributes,
                      });
                    }}
                    className="size-6 rounded-sm mx-0.5"
                  >
                    <Plus size={8} />
                  </Button>
                  <Button
                    onClick={() => {
                      scannedItemsDispatch({
                        type: "DECREMENT",
                        payload: item.attributes,
                      });
                    }}
                    className="size-6 rounded-sm mx-0.5"
                  >
                    <Minus size={8} />
                  </Button>
                </>
              )}
              <Button
                onClick={() => {
                  scannedItemsDispatch({
                    type: "REMOVE",
                    payload: item.attributes,
                  });
                }}
                className="size-6 rounded-sm mx-0.5"
                variant={"destructive"}
              >
                <X size={4} />
              </Button>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function EmptyList({ active }: { active?: boolean }) {
  return (
    <div className="opacity-10 h-full flex flex-col justify-center items-center ">
      <span className="text-4xl">
        {active ? "scan items" : "click here to start scannig"}
      </span>
      <Barcode size={40} />
    </div>
  );
}
