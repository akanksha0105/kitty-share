import React from "react";
import ReactDOM from "react-dom/client"; // Updated import for React 18
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";


const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker
serviceWorkerRegistration.register();
// import React from "react";
// import ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// // Render the App component
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// // Register the service worker
// serviceWorkerRegistration.register();
