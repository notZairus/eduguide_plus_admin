import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const [location, navigate] = useLocation();

  useEffect(() => {
    navigate("/login");
  }, []);

  return (
    <>
      <Switch>
        <Route path="/login" component={LoginPage} />

        <Route path="/users/:name">
          {(params) => <>Hello, {params.name}!</>}
        </Route>

        {/* Default route in a switch */}
        <Route>404: No such page!</Route>
      </Switch>
    </>
  );
};

export default App;
