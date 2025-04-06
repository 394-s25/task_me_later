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
import CloseIcon from "@mui/icons-material/Close";
import tml_logo from "../imgs/tml_logo.png";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

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
      <img className="p-3 mx-auto items-center" src={tml_logo}></img>
      <div className="bg-gray-100 rounded-2xl">
        <div className="flex flex-wrap justify-center items-center mx-auto bg-gray">
          {taskData2.tasks.map((taskItem) => (
            <>
              <Card
                className="w-35 m-3 border rounded-2xl"
                onClick={() => {
                  handleCardClick(taskItem);
                  console.log(taskItem);
                }}
              >
                <CardActionArea>
                  <CardContent>
                    <h1>{taskItem.task_title}</h1>
                    <h1 className="text-[12px]">Due: {taskItem.due_date}</h1>
                    <hr />
                    <div>
                      {/* <Stack direction="row" spacing={1}> */}
                      <Chip
                        label="primary"
                        color="primary"
                        size="small"
                        className="w-100"
                      />
                      <Chip label="success" color="success" size="small" />
                      {/* </Stack> */}
                    </div>

                    {/* <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {taskItem.task_score}
                      <br />
                      {taskItem.task_match}
                    </Typography> */}
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
        </div>
      </div>
    </>
  );
}
