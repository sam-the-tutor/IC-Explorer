import { HttpAgent } from '@dfinity/agent';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GovernanceCanister } from '@dfinity/nns';
const useGetNeurons = () => {
  const [neuronInfo, setNeuronInfo] = useState(null);
  const { userPrincipalId } = useParams();

  const HOST =
    process.env.DFX_NETWORK === 'ic'
      ? 'https://mainnet.dfinity.network'
      : 'http://localhost:4943';

  const MY_GOVERNANCE_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';

  async function getAllNeurons() {
    //create an agent using anonymous credentials
    const agent = new HttpAgent({ host: HOST });
    if (userPrincipalId === '') return;
    const { listNeurons } = GovernanceCanister.create({
      agent,
      canisterId: MY_GOVERNANCE_CANISTER_ID,
    });
    //get all the neurons for the user
    const myNeurons = await listNeurons({ certified: false });
    console.log('my Neurons :', myNeurons);
    setNeuronInfo(myNeurons);
    //
  }

  return {
    getAllNeurons,
    neuronInfo,
  };
};

export default useGetNeurons;
