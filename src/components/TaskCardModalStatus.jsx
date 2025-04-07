import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function TaskCardModalStatus() {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box class="w-[80%] flex flex-wrap justify-center items-center mx-auto">
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" sx={{ fontSize: "0.875rem" }}>
          Status
        </InputLabel>{" "}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Status"
          onChange={handleChange}
          size="small"
          sx={{
            fontSize: "0.875rem",
            height: 36,
          }}
        >
          <MenuItem value={10}>To Do</MenuItem>
          <MenuItem value={20}>In Progress</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
