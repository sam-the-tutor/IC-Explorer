import React, { useState } from 'react';
import { icrc1_Index_Factory } from '../Utils/icrc1_index.did';
import {
  IndexCanisters,
  getLocalIndexCanisterID,
  transformTransactionArray,
} from '../Utils/Functions';
import { createActor } from '../Utils/createActor';
import { Principal } from '@dfinity/principal';
import { useParams } from 'react-router-dom';

const useGetTokenTransactions = () => {
  const [tokenTransactions, setTokenTransactions] = useState(null);

  async function getUserTokenTransactions(tokenName, userId) {
    if (tokenName === null || userId === '') return;
    try {
      //get the token canister
      const tokenIndexId = getLocalIndexCanisterID(tokenName);
      //create an actor
      const IndexActor = createActor(tokenIndexId, icrc1_Index_Factory);
      //get all transactions of the user
      console.log('index :', IndexActor);
      const transactions = await IndexActor?.get_account_transactions({
        max_results: 20,
        start: [],
        account: {
          owner: Principal.fromText(userId),
          subaccount: [],
        },
      });
      console.log('user transactions :', transactions.Ok);

      if (transactions.Ok) {
        const transformedData = transformTransactionArray(
          transactions.Ok.transactions,
        );
        console.log('user transactions :', transformedData);
        setTokenTransactions(transformedData);
      }
    } catch (error) {
      console.log('error in getting user token transactions :', error);
    }
  }

  return { tokenTransactions, getUserTokenTransactions };
};

export default useGetTokenTransactions;
