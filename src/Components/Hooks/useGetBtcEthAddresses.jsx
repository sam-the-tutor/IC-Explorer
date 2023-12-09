import React, { useState } from 'react';
import {
  canisterId as backendCanisterID,
  idlFactory,
} from '../../declarations/backend';
import { createActor } from '../Utils/createActor';
import { Principal } from '@dfinity/principal';
import Moralis from '../../moralis-init';

const useGetBtcEthAddresses = () => {
  const [ethData, setEthData] = useState({
    ethAddress: null,
    ethBalance: null,
  });
  const [btcData, setBtcData] = useState({
    btcAddress: null,
    btcAmount: null,
  });

  async function getEthBtcData(principal_id) {
    try {
      console.log('sdhsdvkjkscv :', principal_id);
      //create the backend actor

      const backendActor = createActor(backendCanisterID, idlFactory);

      console.log('backedn actor :', backendActor);
      const [eth, btc] = await Promise.all([
        backendActor?.createEthAddress(Principal.fromText(principal_id)),
        backendActor?.get_p2pkh_address(Principal.fromText(principal_id)),
      ]);

      // setEthAddress(eth?.ok);

      //get the ethereum balance of the eth address generated
      const { jsonResponse } = await Moralis.EvmApi.balance.getNativeBalance({
        address: eth?.ok.address,
        chain: '0x5', //georli testnet
      });

      setEthData((prev) => ({
        ...prev,
        ethAddress: eth?.ok?.address,
        ethBalance: Number(jsonResponse?.balance) / 1e8,
      }));

      console.log('ethereum balance :', jsonResponse);
      // setBtcData(jsonResponse?.balance);
      //get the balance of the bitcoin address
      const btcBal = await backendActor?.get_balance(btc);

      setBtcData((prev) => ({
        ...prev,
        btcAddress: btc,
        btcAmount: Number(btcBal) / 1e8,
      }));
    } catch (error) {
      console.log('error in getting eth btc data from the backend :', error);
    }
  }

  return { ethData, btcData, getEthBtcData };
};

export default useGetBtcEthAddresses;
