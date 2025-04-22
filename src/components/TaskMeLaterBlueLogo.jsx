import { Card } from "@mui/material";
import tml_logo_blue from "../imgs/tml_logo_blue.png";

export default function TaskMeLaterBlueLogo() {
  return (
    <div class="fixed top-0 left-0 w-full z-50">
      <div class="mb-2 bg-white">
        <img
          class="p-3 mx-auto items-center min-h-[100%]"
          src={tml_logo_blue}
        ></img>
        <hr class="text-gray-200" />
      </div>
    </div>
  );
}
