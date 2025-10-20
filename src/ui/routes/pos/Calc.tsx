import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Parser } from "expr-eval";
import { useStore } from "@/lib/StoreContext";
type Props = {};

const button = [
  ["C", "(", ")", "/"],
  ["7", "8", "9", "x"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "00", "="],
];

function isOp(a: string): boolean {
  return (
    a === "+" ||
    a === "-" ||
    a === "*" ||
    a === "x" ||
    a === "X" ||
    a === "/" ||
    a === "." ||
    a === "(" ||
    a === ")" ||
    !isNaN(parseFloat(a))
  );
}

function toOp(a: string) {
  if (!isOp(a)) {
    return "";
  }
  if (a === "x" || a === "X") {
    return "*";
  }
  return a;
}

export default function Calc({}: Props) {
  const [op, setOp] = useState<string>("");
  const { scannedItemsDispatch } = useStore();

  const calcRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opRef = useRef(op);

  const listener = (e: KeyboardEvent) => {
    if (isOp(e.key)) {
      setOp((prev) => prev + toOp(e.key));
    } else if (e.key === "Backspace") {
      setOp((prev) => prev.slice(0, prev.length - 1));
    } else if (e.key === "=" || e.key === "Enter") {
      try {
        const res = Parser.evaluate(opRef.current);
        if (res > 0) {
          scannedItemsDispatch({
            type: "ADD",
            payload: { code: "", name: "<unnamed>", price: res },
          });
          setOp("");
        }
      } catch (error) {
        setOp("err");
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setOp("");
          timeoutRef.current = null;
        }, 1000);
      }
    }
  };

  useEffect(() => {
    opRef.current = op;
  }, [op]);

  useEffect(() => {
    calcRef.current?.addEventListener("keydown", listener);

    return () => {
      calcRef.current?.removeEventListener("keydown", listener);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={calcRef}
      tabIndex={1}
      className="group w-fit h-fit rounded-xs mt-1 border border-border overflow-hidden"
    >
      <div className="flex font-DSEG w-full overflow-x-clip text-right h-17  group-focus-within:bg-stone-400 bg-stone-900 text-stone-900 transition-colors text-sm">
        <div className="w-7 h-full font-mono font-bold text-xl items-center flex justify-center align-middle">
          +
        </div>
        <div className="text-lg flex flex-col h-full w-full justify-evenly overflow-x-hidden pr-1.5">
          <div>{op}</div>
        </div>
      </div>
      <div className="buttons mx-auto w-fit">
        {button.map((row, i) => {
          return (
            <div className="flex" key={i}>
              {row.map((cell, j) => {
                return (
                  <Button
                    key={j}
                    variant={"secondary"}
                    className={`${
                      cell == "=" ? "bg-amber-700 hover:bg-amber-600" : ""
                    } w-16 h-17 rounded-none border border-border`}
                    onMouseDown={() => {
                      if (isOp(cell) || cell === "=") {
                        calcRef.current?.dispatchEvent(
                          new KeyboardEvent("keydown", {
                            key: cell,
                            bubbles: true,
                            cancelable: true,
                          })
                        );
                      } else if (cell === "C") {
                        setOp("");
                      }
                    }}
                  >
                    {cell}
                  </Button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
