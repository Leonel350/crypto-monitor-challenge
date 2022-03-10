import "./App.css";
import Dashboard from "./components/Dashboard";
import Add from "./components/Add";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sell from "./components/Sell";
import MagicConversion from "./components/MagicConversion";
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Dashboard></Dashboard>
        </Route>
        <Route exact path="/add">
         <Add></Add>
        </Route>
        <Route exact path="/sell">
         <Sell></Sell>
        </Route>
        <Route exact path="/conversion">
         <MagicConversion></MagicConversion>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
