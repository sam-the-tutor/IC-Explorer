import React, { useEffect, useState } from 'react';
import { extendedTokenData } from '../Utils/Data';
import { createActor } from '../Utils/createActor';
import { price_oracle_idlFactory } from '../Utils/pricoOracle.did.js';
import { formatExtendedTokenData } from '../Utils/Functions';

const useGetTokenInformation = () => {
  const BLAST_CANISTER_ID = 'u45jl-liaaa-aaaam-abppa-cai';
  const [tokenInformation, setTokenInformaton] = useState(null);
  const [blastData, setBlastData] = useState(null);

  useEffect(() => {
    LoadTokenData();
  }, []);

  async function LoadTokenData() {
    if (process.env.DFX_NETWORK !== 'ic') {
      setBlastData(extendedTokenData);
    } else {
      //fetch the data from the BLAST canister and update it.
      const priceIOracle = createActor(
        BLAST_CANISTER_ID,
        price_oracle_idlFactory,
      );
      //fetch the data
      const data = priceIOracle?.get_latest_extended();
      setBlastData(data);
    }
  }

  async function getTokenInfo(tokenName) {
    if (tokenName === '') return;
    const tokenInfo = formatExtendedTokenData(tokenName, blastData);
    console.log('token info :', tokenInfo);
    setTokenInformaton(tokenInfo);
  }

  return { tokenInformation, getTokenInfo };
};

export default useGetTokenInformation;
