// @flow

import React from "react";

import { createStackNavigator } from "react-navigation";

import SendSetupScreen from "../screens/SendSetupScreen";
import SendConfirmScreen from "../screens/SendConfirmScreen";
import SendSuccessScreen from "../screens/SendSuccessScreen";
import Bip70ConfirmScreen from "../screens/Bip70ConfirmScreen";
import Bip70SuccessScreen from "../screens/Bip70SuccessScreen";

import { spaceBadger as theme } from "../themes/spaceBadger";

// const Bip70Stack = createStackNavigator(
//   {
//     Bip70RConfirm: {
//       screen: Bip70ConfirmScreen
//     },
//     Bip70Success: {
//       screen: Bip70SuccessScreen
//     }
//   },
//   { defaultNavigationOptions: { header: null } }
// );

const SendStack = createStackNavigator(
  {
    SendSetup: {
      screen: SendSetupScreen,
      navigationOptions: {
        title: "Setup Transaction"
      }
    },
    SendConfirm: {
      screen: SendConfirmScreen,
      navigationOptions: {
        title: "Confirm & Send"
      }
    },
    Bip70Confirm: {
      screen: Bip70ConfirmScreen,
      navigationOptions: {
        title: "Payment Request"
      }
    },
    Bip70Success: {
      screen: Bip70SuccessScreen
    },
    // SendBip70Flow: {
    //   screen: Bip70Stack
    //   // navigationOptions: {
    //   //   title: 'Send BIP70 Payment',
    //   // }
    // },
    SendSuccess: {
      screen: SendSuccessScreen,
      navigationOptions: { header: null }
    }
  },
  {
    initialRouteName: "SendSetup",
    headerLayoutPreset: "center",
    defaultNavigationOptions: {
      headerBackTitleStyle: {
        color: theme.primary500
      },
      headerTintColor: theme.primary500,
      headerTitleStyle: { color: theme.fg100 }
    }
  }
);

export default SendStack;
