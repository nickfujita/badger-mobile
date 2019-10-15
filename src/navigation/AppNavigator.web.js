// @flow

import { createAppContainer, createSwitchNavigator } from "react-navigation";

// import { createSwitchNavigator } from "@react-navigation/core";
// import { createBrowserApp } from "@react-navigation/web";

import MainAppStack from "./MainTabNavigator";
import AuthLoadingScreen from "./AuthLoadingScreen";
import AuthStack from "./AuthStack";

// import SendStack from "./SendStack";

// export default createBrowserApp(
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthStack: { screen: AuthStack, path: "" },
      // SendStack: { screen: SendStack },
      AuthLoadingCheck: { screen: AuthLoadingScreen, path: ":address" },
      Main: { screen: MainAppStack, path: "" }
    },
    {
      initialRouteName: "AuthLoadingCheck"
    }
  )
);
