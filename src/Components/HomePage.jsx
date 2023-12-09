import React from 'react';

const HomePage = () => {
  return (
    <div className=" text-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to BlockchainScout Dapp
        </h1>
        <p className="text-lg mb-8">
          Explore the Internet Computer Blockchain with our token explorer
        </p>
        <a
          href="/kkk"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default HomePage;
