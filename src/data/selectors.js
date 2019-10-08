// @flow

import { createSelector } from "reselect";
import BigNumber from "bignumber.js";
import _ from "lodash";

import { activeAccountSelector } from "./accounts/selectors";
import { transactionsSelector } from "./transactions/selectors";
import { utxosByAccountSelector } from "./utxos/selectors";

// number, but actually BigNumber.
export type Balances = {
  satoshisAvailable: BigNumber,
  satoshisLockedInMintingBaton: BigNumber,
  satoshisLockedInTokens: BigNumber,
  slpTokens: { [tokenId: string]: BigNumber }
};

const transactionsActiveAccountSelector = createSelector(
  activeAccountSelector,
  transactionsSelector,
  (activeAccount, transactions) => {
    if (!activeAccount) return [];

    const { address } = activeAccount;
    const { byId, byAccount } = transactions;

    if (!address) return [];

    const accountTransactionIds = byAccount[address] || [];

    const accountTransactions = accountTransactionIds.map(
      txHash => byId[txHash]
    );

    const sortedTransactions = _.sortBy(accountTransactions, [
      "time"
    ]).reverse();
    return sortedTransactions;
  }
);

const transactionsLatestBlockSelector = createSelector(
  transactionsActiveAccountSelector,
  transactions => {
    const latestBlock = transactions.reduce(
      (acc, curr) => (curr.block > acc ? curr.block : acc),
      0
    );
    return latestBlock;
  }
);

const balancesSelector = createSelector(
  utxosByAccountSelector,
  utxos => {
    const balancesInitial: Balances = {
      satoshisAvailable: new BigNumber(0),
      satoshisLockedInMintingBaton: new BigNumber(0),
      satoshisLockedInTokens: new BigNumber(0),
      slpTokens: {}
    };

    if (!utxos) return balancesInitial;

    const balances: Balances = utxos.reduce((prev, utxo) => {
      if (!utxo) return prev;

      if (utxo.slp && utxo.validSlpTx) {
        if (utxo.slp.baton) {
          return {
            ...prev,
            satoshisLockedInMintingBaton: prev.satoshisLockedInMintingBaton.plus(
              utxo.satoshis
            )
          };
        } else {
          const { token, quantity } = utxo.slp;
          const previousQuantity = prev.slpTokens[token] || new BigNumber(0);
          return {
            ...prev,
            satoshisLockedInTokens: prev.satoshisLockedInTokens.plus(
              utxo.satoshis
            ),
            slpTokens: {
              ...prev.slpTokens,
              [token]: previousQuantity.plus(quantity)
            }
          };
        }
      }
      if (utxo.spendable) {
        return {
          ...prev,
          satoshisAvailable: prev.satoshisAvailable.plus(utxo.satoshis)
        };
      }
      return prev;
    }, balancesInitial);

    return balances;
  }
);

export {
  balancesSelector,
  transactionsActiveAccountSelector,
  transactionsLatestBlockSelector
};
