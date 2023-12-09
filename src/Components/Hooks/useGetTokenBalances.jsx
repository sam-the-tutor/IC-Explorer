import React, { useState } from 'react';
import { createActor } from '../Utils/createActor';
import { CanisterIDS, transformDataArray } from '../Utils/Functions';
import { Principal } from '@dfinity/principal';
import { icrcIdlFactory } from '../Utils/icrc1_ledger.did';
const useGetTokenBalances = () => {
  const [userTokenBalances, setTokenBalance] = useState(null);
  const userBalances = [];
  async function getAllTokenBalances(userPrincipalsID) {
    console.log(userPrincipalsID);
    if (userPrincipalsID === '') return;
    try {
      //fetch the account addresses of the user
      for (const canID of CanisterIDS) {
        let TokenLedger = createActor(canID, icrcIdlFactory);

        const bal = await TokenLedger?.icrc1_balance_of({
          owner: Principal.fromText(userPrincipalsID),
          subaccount: [],
        });
        const tokenMetadata = await TokenLedger.icrc1_metadata();
        const testObj = {
          principal_id: userPrincipalsID,
          items: [
            {
              amount: Number(bal),
              canister_id: canID,
              token_symbol: tokenMetadata[2][1]?.Text,
              token_decimals: Number(tokenMetadata[0][1]?.Nat),
            },
          ],
        };
        ///////////

        let found = false;
        for (let i = 0; i < userBalances.length; i++) {
          if (userBalances[i].principal_id === userPrincipalsID) {
            userBalances[i].items = userBalances[i].items.concat([
              {
                amount: Number(bal),
                canister_id: canID,
                token_symbol: tokenMetadata[2][1]?.Text,
                token_decimals: Number(tokenMetadata[0][1]?.Nat),
              },
            ]);
            found = true;
            break;
          }
        }
        if (!found) {
          userBalances.push(testObj);
        }
      }
      const transformedData = transformDataArray(userBalances);
      setTokenBalance(transformedData);
      return transformedData;
    } catch (error) {
      console.log('error in front balances', error);
    }
  }

  return { userTokenBalances, getAllTokenBalances };
};

export default useGetTokenBalances;
