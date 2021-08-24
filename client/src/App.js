import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import HomeScreen from "./HomeScreen";
import CodeInputScreen from "./CodeInputScreen";
import TextInputScreen from "./TextInputScreen";

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/code">
            <CodeInputScreen />
          </Route>
          <Route path="/text">
            <TextInputScreen />
          </Route>
          <Route path="/">
            <HomeScreen />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
