import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { FaCopy } from 'react-icons/fa';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import useGetTokenBalances from './Hooks/useGetTokenBalances';
import { fixDecimals, shorten17String, shortenString } from './Utils/Functions';
import useGetTokenTransactions from './Hooks/useGetTokenTransactions';
import TransactionTable from './Utils/TransactionTable';
import useGetTokenInformation from './Hooks/useGetTokenInformation';
import useGetBtcEthAddresses from './Hooks/useGetBtcEthAddresses';
import useGetNeurons from './Hooks/useGetNeurons';
const Dashboard = () => {
  const { userPrincipalId } = useParams();
  const { userTokenBalances, getAllTokenBalances } = useGetTokenBalances();
  const [selectedToken, setSelectedToken] = useState('ckBTC');
  const { tokenTransactions, getUserTokenTransactions } =
    useGetTokenTransactions();
  const { ethData, btcData, getEthBtcData } = useGetBtcEthAddresses();
  const { tokenInformation, getTokenInfo } = useGetTokenInformation();

  const { neuronInfo, getAllNeurons } = useGetNeurons();
  useEffect(() => {
    ss();
    getEthBtcData(userPrincipalId);
    getTokenInfo(selectedToken);
    getUserTokenTransactions(selectedToken, userPrincipalId);
    // getAllNeurons();
  }, [selectedToken, userPrincipalId]);

  async function ss() {
    await getAllTokenBalances(userPrincipalId);
  }

  console.log('token balances :', userTokenBalances);
  console.log('daH INFO :', tokenInformation);
  console.log('eth address :', ethData, btcData);
  return (
    <>
      <div className="flex mx-10 flex-col px-10">
        {/* display the principal id and the account */}
        <div className="flex justify-evenly border-b-1 py-4 w-full border-b-2 gap-2">
          <div
            style={{ backgroundColor: '#1D1F31' }}
            className="flex flex-col justify-between gap-1 w-full rounded-sm"
          >
            <div className="flex flex-col gap-1 justify-center items-center ">
              <div className="flex justify-center items-center px-2">
                <h2 style={{ color: '#4A68B9' }}>Principal ID</h2>
                <FaCopy className="ml-2" />
              </div>
              <span>
                {userPrincipalId ? shorten17String(userPrincipalId) : null}
              </span>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center ">
              <div className="flex justify-center items-center px-2">
                <h2 style={{ color: '#4A68B9' }}>Account ID</h2>
                <FaCopy className="ml-2" />
              </div>
              <span>
                {userPrincipalId
                  ? shorten17String(
                      AccountIdentifier.fromPrincipal({
                        principal: Principal.fromText(userPrincipalId),
                        subAccount: undefined,
                      }).toHex(),
                    )
                  : null}
              </span>
            </div>
          </div>
          {/* ethereum board */}
          <div
            style={{ backgroundColor: '#555555' }}
            className="flex flex-col justify-between gap-1 w-full rounded-sm"
          >
            <div className="flex flex-col gap-1 justify-center items-center  ">
              <div className="flex justify-center items-center px-2">
                <h2 style={{ color: '#fff6' }}>Ethereum Address</h2>
                <FaCopy className="ml-2" />
              </div>
              <span className="px-2">
                {ethData?.ethAddress !== null
                  ? ethData?.ethAddress
                  : 'loading...'}
              </span>
            </div>
            <div className="flex flex-col">
              <div
                style={{ color: '#fff6' }}
                className="flex justify-center items-center px-2"
              >
                Balance
              </div>
              {/* <span>Balance</span> */}
              <span>
                {ethData?.ethBalance !== null
                  ? ethData?.ethBalance + ' ETH'
                  : 'loading'}
              </span>
            </div>
          </div>

          {/* bitcoin board */}
          <div
            style={{ backgroundColor: '#AE641E' }}
            className="flex flex-col justify-between rounded-sm gap-1 w-full"
          >
            <div className="flex flex-col gap-1 justify-center items-center ">
              <div
                style={{ color: '#FFE4B5' }}
                className="flex justify-center items-center px-2"
              >
                <h2>Bitcoin Address</h2>
                <FaCopy className="ml-2 text-white" />
              </div>
              <span>
                {btcData?.btcAddress !== null
                  ? btcData?.btcAddress
                  : 'loading...'}
              </span>
            </div>
            <div className="flex flex-col">
              <div
                style={{ color: '#FFE4B5' }}
                className="flex justify-center items-center px-2"
              >
                Balance
              </div>
              <span>
                {btcData?.btcAmount !== null
                  ? btcData?.btcAmount + ' BTC'
                  : 'loading'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-2 mt-4">
          {/* show all the token holdings of the user from all the possible token ledgers available */}
          <div
            style={{ backgroundColor: '#1D1F31', height: '370px' }}
            className="flex flex-col w-1/4 rounded-md shadow-sm h-full "
          >
            <div
              style={{ color: '#4A68B9' }}
              className="flex justify-center items-center p-2"
            >
              <h3>Token Balances</h3>
            </div>
            <div>
              {userTokenBalances &&
                Object.entries(userTokenBalances)?.map(([key, value]) => (
                  <div key={key}>
                    <span
                      className="hover:cursor-pointer"
                      onClick={() => setSelectedToken(key)}
                    >
                      {fixDecimals(value)} {key}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          {/* show the transactions of that specific user id for the token clicked on */}
          <div className="flex flex-col w-3/4 rounded-md shadow-md h-full">
            {/* <h3>Transaction History</h3> */}
            {tokenInformation && (
              <div className="flex justify-between items-center">
                <div
                  style={{ backgroundColor: '#1D1F31' }}
                  className="flex flex-col rounded-sm justify-center px-4 items-center py-2 "
                >
                  <span style={{ color: '#4A68B9' }}>Token</span>
                  <span>{tokenInformation[0]?.symbol}</span>
                </div>
                <div
                  style={{ backgroundColor: '#1D1F31' }}
                  className="flex flex-col justify-center rounded-sm items-center px-4 py-2 "
                >
                  <span style={{ color: '#4A68B9' }}>Price</span>
                  <span>{tokenInformation[0]?.price_USD}</span>
                </div>
                <div
                  style={{ backgroundColor: '#1D1F31' }}
                  className="flex flex-col justify-center rounded-sm items-center px-4 py-2 "
                >
                  <span style={{ color: '#4A68B9' }}>Volume(USD)</span>
                  <span>{tokenInformation[0]?.volume_USD}</span>
                </div>
                <div
                  style={{ backgroundColor: '#1D1F31' }}
                  className="flex flex-col justify-center rounded-sm items-center px-4 py-2 "
                >
                  <span style={{ color: '#4A68B9' }}>Marketcap(USD)</span>
                  <span>{tokenInformation[0]?.marketcap_USD}</span>
                </div>
                <div
                  style={{ backgroundColor: '#1D1F31' }}
                  className="flex flex-col justify-center rounded-sm items-center px-4 py-2 "
                >
                  <span style={{ color: '#4A68B9' }}>Total Supply</span>
                  <span>{tokenInformation[0]?.total}</span>
                </div>
              </div>
            )}

            <div
              style={{ backgroundColor: '#1D1F31', maxHeight: '290px' }}
              className="flex py-4 mt-4 rounded-sm overflow-x-auto"
            >
              {tokenTransactions?.length > 0 ? (
                <TransactionTable
                  data={tokenTransactions}
                  tokenName={selectedToken}
                />
              ) : (
                <div className="flex justify-center items-center w-full">
                  No transaction history found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
