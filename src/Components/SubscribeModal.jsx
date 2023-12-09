import React, { useState } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { createActor } from './Utils/createActor';
import { idlFactory, canisterId } from '../declarations/backend';
import { Principal } from '@dfinity/principal';
function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    principal_id: null,
    email_address: null,
  });

  async function handleSubmit(e) {
    e.preventDefault();

    //check if the field are filled
    if (!formData.email_address || !formData.principal_id) {
      alert('All form fields must be filled');
    }

    //create the backend actor ansd send the details if the user

    const backendActor = createActor(canisterId, idlFactory);
    console.log('backend actor :', backendActor, formData);
    //send the details

    const results = await backendActor.addNewSubscriber(
      Principal.fromText(formData.principal_id),
      formData.email_address,
    );
    if (results.ok) {
      alert('Real-time Notifications activated');
    }
    console.log('add new results ;', results);
  }
  function handleChange(e) {
    setFormData((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <>
      <div>
        <FaBell
          onClick={() => setIsOpen(true)}
          className="text-gray-600 text-2xl inline-block mr-4 "
        />
        <FaUserCircle className="text-gray-600 text-2xl inline-block" />
      </div>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center  justify-center min-h-screen">
            <div
              style={{ backgroundColor: '#11131f' }}
              className="fixed inset-0 bg-slate-300  bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <div
              style={{ backgroundColor: '#1D1F31' }}
              className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full"
            >
              <form onSubmit={handleSubmit}>
                <div className="p-4">
                  <label htmlFor="principal_id" className="block font-medium">
                    Principal ID
                  </label>
                  <input
                    type="text"
                    id="principal_id"
                    onChange={handleChange}
                    name="principal_id"
                    className="mt-1 w-full rounded-md border border-purple-400 focus:outline-none"
                  />
                </div>
                <div className="p-4">
                  <label htmlFor="email" className="block font-mediumm">
                    Email Address
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    id="email_address"
                    name="email_address"
                    className="mt-1 w-full rounded-md border border-purple-400 focus:outline-none"
                  />
                </div>
                <div className="p-4 flex gap-2">
                  <button
                    onClick={(e) => handleSubmit}
                    type="submit"
                    className="border border-black-200 p-2 rounded-lg text-bold text-sm shadow shadow-black"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="border border-black-200 p-2 rounded-lg text-bold text-sm shadow shadow-black"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SubscribeModal;
