import { useStore } from "@/lib/StoreContext";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {};

export default function ItemList({}: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const [barcode, setBarcode] = useState("");

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
      onFocus={() => console.log("focused")}
      onBlur={() => console.log("blurred")}
      className="focus:border border-border w-full h-full bg-accent"
    >
      {scannedItems.length == 0 && <div>click here and scan items</div>}
      {scannedItems.map((item) => {
        return <div key={item.item.id}>{item.item.name}</div>;
      })}
    </div>
  );
}
