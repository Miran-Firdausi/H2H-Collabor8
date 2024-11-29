import { BrowserRouter as Router } from "react-router-dom";
import { KanbanProvider } from "./contexts/KanbanContext";
import AppRoutes from "./routes/AppRoutes";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <KanbanProvider>
        <Router>
          <AppRoutes />
        </Router>
      </KanbanProvider>
    </Provider>
  );
};

export default App;
