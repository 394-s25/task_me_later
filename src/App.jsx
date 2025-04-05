import "./App.css";
import TaskCardPreview from "./components/TaskCardPreview";
import mockData from "../mock_data.json";

const App = () => {
  return (
    <>
      <div>
        <h1 class="text-3xl font-bold underline">Hello world!!!!!!</h1>

        <TaskCardPreview
        //  taskData={mockData}
        />
      </div>
    </>
  );
};

export default App;
