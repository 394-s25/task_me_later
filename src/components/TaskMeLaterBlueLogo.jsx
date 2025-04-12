import { Card } from "@mui/material";
import tml_logo_blue from "../imgs/tml_logo_blue.png";

export default function TaskMeLaterBlueLogo() {
  return (
    <div class="mb-2">
      <Card>
        <img
          className="p-3 mx-auto items-center min-h-[100%]"
          src={tml_logo_blue}
        ></img>
      </Card>
    </div>
  );
}
