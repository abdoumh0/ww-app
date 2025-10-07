import { Link } from "react-router";
import Calc from "./Calc";
import { ModeToggle } from "./ThemeChange";

type Props = {};

export default function Pos({}: Props) {
  return (
    <div>
      <ModeToggle />
      <Link to="/">GO HOME</Link>
      <Calc total={0} />
    </div>
  );
}
