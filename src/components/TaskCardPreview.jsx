import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import { Button } from "@mui/material";
import { useState } from "react";
import TaskCardModal from "./TaskCardModal";
import taskData2 from "../../mock_data.json";
import tml_logo from "../imgs/tml_logo.png";
import Chip from "@mui/material/Chip";

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
      <div style={{ bgcolor: "lightblue" }}>
        <img
          className="p-3 mx-auto items-center min-h-[100%]"
          src={tml_logo}
        ></img>
      </div>
      <div className="bg-gray-100 rounded-2xl ">
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
                    <h1 className="font-bold">{taskItem.task_title}</h1>
                    <h1 className="text-[12px]">Due: {taskItem.due_date}</h1>
                    <hr />
                    <div className="mt-1">
                      {taskItem.task_status === "Completed" ? (
                        <Chip
                          label={taskItem.task_status}
                          size="small"
                          style={{
                            backgroundColor: "lightgreen",
                            color: "black",
                          }}
                        />
                      ) : taskItem.task_status === "In Progress" ? (
                        <Chip
                          label={taskItem.task_status}
                          size="small"
                          style={{
                            backgroundColor: "orange",
                            color: "black",
                          }}
                        />
                      ) : (
                        taskItem.task_status === "To Do" && (
                          <Chip
                            label={taskItem.task_status}
                            size="small"
                            style={{
                              backgroundColor: "red",
                              color: "white",
                            }}
                          />
                        )
                      )}

                      {/* <Chip label="success" color="success" size="small" /> */}
                      {/* </Stack> */}
                    </div>
                    <hr className="mt-1" />
                    <div className="flex flex-col items-center mx-auto">
                      <Button
                        style={{
                          backgroundColor: "yellow",
                          color: "black",
                          marginLeft: 1,
                          marginTop: 5,
                          height: 20,
                          border: "1px solid lightgray",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        GET HELP
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "lightgreen",
                          color: "black",
                          marginTop: 5,
                          height: 20,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        MARK DONE
                      </Button>
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
