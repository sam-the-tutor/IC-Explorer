import React, { useState } from 'react';
import { FaUserCircle, FaBell, FaSearch } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import SubscribeModal from './SubscribeModal';
const Navbar = () => {
  const [principalId, setID] = useState('');
  const navigate = useNavigate();
  async function handleSearch() {
    if (principalId === '') return;
    navigate(`${principalId}`);
  }
  return (
    <div className="py-2 px-6 flex justify-between items-center w-full border-b-2 border-gray-300">
      <div>
        <img
          src="https://cdn.discordapp.com/attachments/950584476658962473/1181015551812849745/Screenshot_from_2023-12-04_02-33-41-removebg-preview.png"
          alt="Logo"
          className="h-8"
        />
      </div>
      <div
        style={{ backgroundColor: '#2D3348' }}
        className="flex gap-2 px-4 justify-between items-center rounded-md focus:outline-none focus:ring-2 focus: "
      >
        <input
          value={principalId}
          onChange={(e) => setID(e.target.value)}
          name="principalID"
          type="text"
          placeholder="Enter your Principal ID"
          className="w-4/5 rounded-full focus:outline-none px-2 focus: outline-gray-300 h-10"
          style={{ backgroundColor: '#2D3348' }}
        />
        <FaSearch
          className="hover:cursor-pointer text-white"
          onClick={handleSearch}
        />
      </div>
      <SubscribeModal />
    </div>
  );
};

export default Navbar;
