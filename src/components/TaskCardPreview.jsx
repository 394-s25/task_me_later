import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import TaskCardModal from "./TaskCardModal";
import Chip from "@mui/material/Chip";
import ProjectTag from "./ProjectTag";
import { getUsersTasks, updateTaskStatus } from "../services/tasksServices";

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

  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const unsubscribe = getUsersTasks((fetchedTasks) => {
      console.log("Fetched user tasks:", fetchedTasks);
      setTaskData(fetchedTasks);
    });

    return () => unsubscribe();
  }, []);

  const ProgressChip = ({ taskItem }) => {
    return (
      <>
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
      </>
    );
  };

  return (
    <>
      <div className="bg-gray-100 rounded-2xl">
        <div className="flex flex-wrap justify-center items-center mx-auto bg-gray">
          {taskData
            .filter((task) => task.task_status !== "Completed")
            .map((taskItem) => (
              <>
                <Card
                  className="w-35 m-3 border rounded-2xl"
                  onClick={() => {
                    handleCardClick(taskItem);
                    console.log(taskItem);
                  }}
                >
                  <CardActionArea>
                    <ProjectTag project={taskItem.project_name} />
                    <CardContent>
                      <h1 className="font-bold mt-[-7px]">
                        {taskItem.task_title}
                      </h1>
                      <h1 className="text-[12px]">Due: {taskItem.due_date}</h1>
                      <hr />
                      <div className="mt-1">
                        <ProgressChip taskItem={taskItem} />
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
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await updateTaskStatus(taskItem.id, "Completed");
                              setTaskData((prev) =>
                                prev.filter((task) => task.id !== taskItem.id)
                              );
                            } catch (err) {
                              console.error(
                                "Failed to mark task as done: ",
                                err
                              );
                            }
                          }}
                        >
                          MARK DONE
                        </Button>
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <TaskCardModal
                  task={selectedCard}
                  open={open}
                  onClose={handleDialogClose}
                  setTask={setSelectedCard}
                  allTasks={taskData}
                />
              </>
            ))}
        </div>
      </div>
    </>
  );
}
