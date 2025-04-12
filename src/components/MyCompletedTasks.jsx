import { Card } from "@mui/material";
export default function MyCompletedTasks() {
  return (
    <Card
      sx={{
        marginX: "auto",
        marginY: 2,
        width: "90%",
        backgroundColor: "#f8f8f8",
      }}
    >
      <h1 class="font-bold m-2">My Completed Tasks</h1>
    </Card>
  );
}
