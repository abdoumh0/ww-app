import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type Props = {
  total: number;
};

const button = [
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "x"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
];

export default function Calc({ total }: Props) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      console.log(e.code);
    };
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div>
      <div className="display ">{total}</div>
      <div className="buttons mx-auto w-fit">
        {button.map((row, i) => {
          return (
            <div className="flex" key={i}>
              {row.map((cell, j) => {
                return (
                  <Button
                    key={j}
                    variant={"secondary"}
                    className="w-12 h-12 rounded-none"
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
