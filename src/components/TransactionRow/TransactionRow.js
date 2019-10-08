// @flow

import React from "react";
import styled, { css } from "styled-components";
import {
  View,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity
} from "react-native";
import makeBlockie from "ethereum-blockies-base64";
import moment from "moment";

import Feather from "react-native-vector-icons/Feather";

import { T } from "../../atoms";
import { SLP } from "../../utils/slp-sdk-utils";

const Row = styled(View)`
  padding: 16px;
  margin-bottom: 8px;

  background-color: ${props =>
    ({
      send: props.theme.accent900,
      receive: props.theme.primary900,
      interwallet: props.theme.fg800,
      payout: props.theme.payout900
    }[props.type] || props.theme.fg800)};
`;

const DateRow = styled(View)`
  margin-bottom: 4px;
  flex-direction: row;
  justify-content: space-between;
`;
const MetaRow = styled(View)`
  margin-top: 4px;
`;
const AmountRow = styled(View)`
  flex-direction: row;
`;

const IconArea = styled(View)`
  justify-content: center;
  margin-right: 10px;
`;

const IconImage = styled(Image)`
  width: 36;
  height: 36;
  border-radius: 18;
  overflow: hidden;
`;

const InfoArea = styled(View)`
  flex: 1;
  justify-content: center;
`;
const AmountArea = styled(View)`
  justify-content: center;
`;

let blockieCache = {};

type Props = {
  type: "send" | "receive" | "payout" | "interwallet",
  txId: string,
  timestamp: number,
  toAddress: string,
  toAddresses: string[],
  fromAddresses: string[],
  fromAddress: ?string,
  symbol: string,
  tokenId: string,
  amount: string
};

const TransactionRow = ({
  type,
  txId,
  timestamp,
  toAddresses,
  toAddress,
  fromAddresses,
  fromAddress,
  symbol,
  tokenId,
  amount
}: Props) => {
  const transactionAddress = {
    send: toAddress,
    interwallet: null,
    payout: fromAddress,
    receive: fromAddress
  }[type];

  let formattedTransactionAddress = null;
  try {
    formattedTransactionAddress = tokenId
      ? SLP.Address.toSLPAddress(transactionAddress)
      : transactionAddress;

    // Above method returns an error instead of throwing one for now.
    if (typeof formattedTransactionAddress !== "string") {
      formattedTransactionAddress = null;
    }
  } catch (e) {
    formattedTransactionAddress = null;
  }

  let blockie = blockieCache[transactionAddress];
  if (!blockie) {
    const newBlockie = makeBlockie(transactionAddress || "unknown");
    blockieCache = { ...blockieCache, [transactionAddress]: newBlockie };
    blockie = newBlockie;
  }
  const imageSource = { uri: blockie };

  const typeFormatted = {
    send: "Sent",
    interwallet: "Sent to self",
    receive: "Received",
    payout: "Payout"
  }[type];

  return (
    <Row type={type}>
      <DateRow>
        <T size="small" type="muted">
          {moment(timestamp).format("MM-DD-YYYY, h:mm a")}
        </T>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`https://explorer.bitcoin.com/bch/tx/${txId}`)
          }
        >
          <T size="small" type="muted">
            Explorer <Feather name="external-link" />
          </T>
        </TouchableOpacity>
      </DateRow>
      <AmountRow>
        <IconArea>
          <IconImage source={imageSource} />
        </IconArea>
        <InfoArea>
          <T>{typeFormatted}</T>
        </InfoArea>
        <AmountArea>
          {type !== "interwallet" && (
            <T>
              {type === "send" ? "-" : "+"}
              {amount}
            </T>
          )}
        </AmountArea>
      </AmountRow>
      <MetaRow>
        {transactionAddress && <T size="tiny">{formattedTransactionAddress}</T>}
        <T size="tiny" type="muted">
          {txId}
        </T>
      </MetaRow>
    </Row>
  );
};

export default TransactionRow;
