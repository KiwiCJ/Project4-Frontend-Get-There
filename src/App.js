import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TripList from './components/Trips/TripList'
import NavBar from './components/Navbar/Navbar';
import LoginModal from './components/LoggedUser/LoginModal';
import Logout from './components/LoggedUser/Logout';
import SignupModal from './components/LoggedUser/SignupModal';
import SingleTrip from './components/Trips/SingleTrip.jsx';
import Converter from './components/Converter/Converter.jsx';

function App() {


  return (
  <BrowserRouter>
  <div className="App">
    <NavBar />
    <Routes>
      <Route path='/' element={<Converter />}  />
      <Route path='/login' element={<LoginModal />} />
      <Route path='/logout' element={<Logout />}/>
      <Route path='/signup' element={<SignupModal/>}/>
      <Route path='/trips' element={<TripList />}/>
      <Route path='/converter' element={<Converter />}/> 
      <Route path='/trip/:id' element={<SingleTrip />} />
    </Routes>   
  </div>
      
  </BrowserRouter>
  )
}

export default App;
