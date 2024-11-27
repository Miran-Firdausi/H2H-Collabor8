import { KanbanProvider } from "./contexts/KanbanContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

const App = () => {
  return (
    <KanbanProvider>
      <AppRoutes />
    </KanbanProvider>
  );
};

export default App;
