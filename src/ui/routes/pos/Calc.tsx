import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/StoreContext";
import { useEffect, useRef, useState } from "react";

type Props = {};

const button = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "X"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
];

function isOp(a: string): boolean {
  return (
    a == "+" || a == "-" || a === "*" || a === "x" || a === "X" || a === "/"
  );
}

export default function Calc({}: Props) {
  const { total, setTotal } = useStore();
  const [current, setCurrent] = useState(0);
  const [op, setOp] = useState<string>("");

  const opRef = useRef(op);
  const currentRef = useRef(current);

  useEffect(() => {
    opRef.current = op;
  }, [op]);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      console.log(e.code, e.key);
      if (e.key === "Backspace" || e.key == "Delete") {
        setCurrent((prev) => {
          return Math.floor(prev / 10);
        });
      } else if (isOp(e.key)) {
        if (e.key === "x" || e.key === "X") {
          setOp("*");
        } else {
          setOp(e.key);
        }
      } else if (e.key === "=" || e.key === "Enter") {
        console.log("first");
        switch (opRef.current) {
          case "+":
            setTotal((prev) => prev + currentRef.current);
            setCurrent(0);
            break;
          case "-":
            setTotal((prev) => prev - currentRef.current);
            setCurrent(0);
            break;
          case "*":
            setTotal((prev) => prev * currentRef.current);
            setCurrent(0);
            break;
          case "/":
            if (currentRef.current == 0) {
              break;
            } else {
              setTotal((prev) => prev / currentRef.current);
              setCurrent(0);
              break;
            }

          default:
            console.log("default", op);
            break;
        }
      }
      const n = parseInt(e.key);
      if (!isNaN(n)) {
        setCurrent((prev) => {
          return prev * 10 + n;
        });
      }
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className="w-fit h-fit rounded-sm border border-border overflow-hidden">
      <div className="flex font-DSEG w-full overflow-x-clip text-right h-19 bg-stone-400 text-stone-900">
        <div className="w-7 h-full font-mono font-bold text-xl items-center flex justify-center align-middle">
          {op}
        </div>
        <div className="text-lg flex flex-col h-full w-full justify-evenly overflow-x-hidden">
          <div>{total}</div>
          <div>{current > 0 ? current : ""}</div>
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
                      cell == "=" ? "bg-amber-700" : ""
                    } w-16 h-19 rounded-none border border-border`}
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
