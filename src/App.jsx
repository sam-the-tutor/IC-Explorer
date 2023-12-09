import { useEffect, useState } from 'react';
import './App.css';
import './moralis-init';
import { Route, Router, Routes } from 'react-router-dom';
import SharedLayout from './Components/SharedLayout';
import HomePage from './Components/HomePage';
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/:userPrincipalId" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
