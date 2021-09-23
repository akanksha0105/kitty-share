import React, { Component } from "react";
import "./HomeScreen.css";
import { Redirect } from "react-router-dom";

class HomeScreen extends Component {
  state = {
    redirect: false,
  };

  componentDidMount() {
    this.id = setTimeout(() => this.setState({ redirect: true }), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    return this.state.redirect ? (
      <Redirect to="/text" />
    ) : (
      <div className="center">
        {" "}
        <h1>kitty-share</h1>
      </div>
    );
  }
}

export default HomeScreen;
