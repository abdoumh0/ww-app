import { Button } from "@/components/ui/button";
import Calc from "./Calc";

type Props = {};

export default function Pos({}: Props) {
  return (
    <div>
      <Button
        onClick={async () => {
          const data = { name: "test purchase", items: ["banana", "water"] };
          console.log('invoking "purchase:create" with values: ', data);
          const res = await window.electronAPI.invoke("purchase:create", data);
          if (res.success) {
            console.log("invoke successful");
          } else {
            console.log("invoke failed, check db");
          }
        }}
      >
        Invoke
      </Button>
      <Calc total={0} />
    </div>
  );
}
