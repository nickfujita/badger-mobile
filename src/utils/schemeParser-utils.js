// @flow

import BigNumber from "bignumber.js";
import { Utils } from "slpjs";
import { SLP } from "./slp-sdk-utils";

const tokenIdRegex = /^([A-Fa-f0-9]{2}){32,32}$/;

const parseAddress = (address: string) => {
  let type = getType(address);

  if (type === "cashaddr") {
    try {
      checkIsValid("cashaddr", address);
    } catch (error) {
      throw new Error("invalid address");
    }
    return SLP.Address.toCashAddress(address);
  } else if (type === "slpaddr") {
    try {
      checkIsValid("slpaddr", address);
    } catch (error) {
      throw new Error("invalid address");
    }
    return SLP.Address.toSLPAddress(address);
  }
  return address;
};

// Look into if `amount` is valid here or not
const parseSLP = (
  params: {
    label?: string,
    amount1?: string,
    amount?: string,
    address?: string
  },
  tokensById: any
): {
  address: string,
  amount: string,
  tokenAmount: string,
  label: string,
  symbol: string,
  tokenId: string
} => {
  let amount, symbol, tokenId, tokenAmount;

  const { label, amount1, amount2 } = params;

  if (amount1 !== undefined) {
    // slp amount only
    tokenAmount = amount1.split("-")[0];
    tokenId = amount1.split("-")[1];
  }
  if (amount2 !== undefined) {
    // slp amount only
    tokenAmount = amount2.split("-")[0];
    tokenId = amount2.split("-")[1];
  }
  if (params.amount !== undefined) {
    // slp and bch combined
    amount = params.amount[0];
    tokenAmount = params.amount[1].split(":")[0];
    tokenId = params.amount[1].split(":")[1];
  }

  const tokenInBalance = tokensById[tokenId];
  symbol = tokenInBalance !== undefined ? tokenInBalance.symbol : "---";
  if (tokenAmount !== "") {
    tokenAmount = parseAmount(tokenAmount);
  }

  let obj = {
    address: params.address,
    amount,
    tokenAmount,
    label,
    symbol,
    tokenId
  };

  obj = removeEmpty(obj);

  return obj;
};

const parseBCHScheme = (
  scheme: string
): { address: string, amount: string, label: string, message: string } => {
  let address = getAddress(scheme);
  let amount, label, message;

  try {
    checkIsValid("cashaddr", address);
  } catch (error) {
    throw new Error("invalid address");
  }
  address = SLP.Address.toCashAddress(address);
  amount = getValue(scheme, "amount");

  amount = parseAmount(amount);

  label = getValue(scheme, "label");

  message = getValue(scheme, "message");
  message = message && message.replace(/%20/g, " ");

  let obj = { address, amount, label, message };
  obj = removeEmpty(obj);

  return obj;
};

const parseSLPScheme = (scheme: string, tokensById: object) => {
  let parsed = Utils.parseSlpUri(scheme);

  const { amountBch, amountToken, tokenId } = parsed;
  let address = getAddress(scheme);
  let label, symbol;

  label = getValue(scheme, "label");

  const tokenInBalance = tokenId !== undefined ? tokensById[tokenId] : tokenId;
  symbol = tokenInBalance !== undefined ? tokenInBalance.symbol : "---";

  let obj = {
    address,
    amount: parseAmount(amountBch),
    tokenAmount: parseAmount(amountToken),
    label,
    tokenId,
    symbol
  };

  obj = removeEmpty(obj);
  return obj;
};

const getAddress = (scheme: string) => {
  return scheme.split("?")[0];
};

const getValue = (scheme: ?string, key: string) => {
  if (!scheme) return;
  let value = scheme.split(`${key}=`);
  if (value.length <= 1) {
    return;
  }

  value = value[1] ? value[1].split("&")[0] : value;
  return value;
};

const parseAmount = (value: any) => {
  if (value === undefined) {
    return;
  }

  value = new BigNumber(value);

  if (!isFinite(value)) throw new Error("Invalid amount");
  if (value < 0) throw new Error("Invalid amount");
  return value;
};

const getType = (address: string) => {
  return SLP.Address.detectAddressFormat(address);
};

const checkIsValid = (type: string, address: string) => {
  if (type === "cashaddr") {
    return SLP.Address.isCashAddress(address);
  } else if (type === "slpaddr") {
    return SLP.Address.isSLPAddress(address);
  } else {
    console.log("error in checkisvalid");
  }
};

const removeEmpty = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export {
  parseAddress,
  parseSLP,
  parseBCHScheme,
  parseSLPScheme,
  getAddress,
  getValue,
  parseAmount,
  getType,
  checkIsValid,
  removeEmpty
};
