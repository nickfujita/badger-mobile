import App from "./src/App";
import React from "react";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";

// register the app
AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById("react-app")
});
