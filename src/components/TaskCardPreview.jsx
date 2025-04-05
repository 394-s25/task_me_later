import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import TaskCardModal from "./TaskCardModal";

export default function TaskCardPreview() {
  const [open,setOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(-1)
  const handleCardClick = (taskId) => {
    setOpen(true)
    setSelectedCard(taskId)
  }
  const handleDialogClose = ()=> {
    setOpen(false)
    setSelectedCard(-1)
  }
  return (
    <>
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={() => {handleCardClick}}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            task_title
          </Typography>
          <Typography>
            due_date
          </Typography>
          <Typography variant="body1">
            task_dependency_list
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            task_score
            <br />
            task_match
          </Typography>
          <Typography>
            <Button href="/add_task">
              Add Task
            </Button>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    < TaskCardModal taskId ={selectedCard} open={open} onClose={handleDialogClose} />
    </ >
  );
}
