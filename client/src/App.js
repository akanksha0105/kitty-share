import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import CodeInputScreen from "./screens/CodeInputScreen";
import TextInputScreen from "./screens/TextInputScreen";
// import Example from "./screens/Example";

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
          {/* <Route path="/trash">
            <Example />
          </Route> */}

          <Route path="/">
            <HomeScreen />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
