// @flow

import React from "react";

import styled, { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import { View } from "react-native";
import { PersistGate } from "redux-persist/integration/react";

import AppNavigator from "./navigation/AppNavigator";
import { getStore } from "./data/store";
import { spaceBadger } from "./themes/spaceBadger";

import KeySweepScreen from "./screens/KeySweepScreen";

const { store, persistor } = getStore();

const AppWrapper = styled(View)`
  flex: 1;
`;

const prefix = "bitcoincash:";
const slpPrefix = "simpleledger:";

import "../web/loadIcons";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={spaceBadger}>
          <AppWrapper>
            <KeySweepScreen />
          </AppWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
