import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import TaskCardModal from "./TaskCardModal";
import taskData2 from "../../mock_data.json";

export default function TaskCardPreview() {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(-1);
  const handleCardClick = (task) => {
    setOpen(true);
    setSelectedCard(task);
  };
  const handleDialogClose = () => {
    setOpen(false);
    setSelectedCard(-1);
  };
  return (
    <>
      {taskData2.tasks.map((taskItem) => (
        <>
          <Card
            sx={{ maxWidth: 345 }}
            onClick={() => {
              handleCardClick(taskItem);
              console.log(taskItem);
            }}
          >
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {taskItem.task_title}
                </Typography>
                <Typography>{taskItem.due_date}</Typography>
                <Typography variant="body1">task_dependency_list</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {taskItem.task_score}
                  <br />
                  {taskItem.task_match}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <TaskCardModal
            task={selectedCard}
            open={open}
            onClose={handleDialogClose}
          />
        </>
      ))}
    </>
  );
}
