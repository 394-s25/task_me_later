import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';


export default function TaskCardPreview() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={() => {console.log("Card clicked")}}>
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
  );
}
