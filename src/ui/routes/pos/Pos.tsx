import Calc from "./Calc";
import { Input } from "@/components/ui/input";
import ItemList from "./ItemList";
import { useStore } from "@/lib/StoreContext";

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
  const { total } = useStore();
  return (
    <div className="flex justify-between flex-1">
      <div className="h-80">
        <Input type="text" placeholder="Search"></Input>
        <div className="font-DSEG text-green-600 text-6xl">{total}</div>
        <ItemList />
      </div>
      <div className="absolute bottom-0 right-0 w-fit">
        <Calc />
      </div>
    </div>
  );
}
