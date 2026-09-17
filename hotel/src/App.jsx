import { useState } from "react";
import {Routes, Route} from "react-router-dom";
import "./App.css"
import Auth from "./pages/Auth";
import Navbar from "./components/navbar";
import Guest from "./pages/Guest";
import Dashboard from "./pages/Dashboard";
import Service from "./pages/Service";
import Guestservice from "./pages/Guestservice";
import Footer from "./components/footer";
import Employee from "./pages/Employee";
import Reservation from "./pages/Reservation";
import Room from "./pages/Room";
import Roomtype from "./pages/Roomtype";
import Payment from "./pages/Payment"; 
import Housekeeping from "./pages/Housekeeping";                                                     
import Home from "./pages/Home";


function App(){
    return(
         <div className="app">
            <Navbar/>
            <Routes>
                <Route path="/auth" element={<Auth/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/guest" element={<Guest/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/service" element={<Service/>}/>
                <Route path="/guestservice" element={<Guestservice/>}/>
                <Route path="/employee" element={<Employee/>}/>
                <Route path="/reservation" element={<Reservation/>}/>
                <Route path="/room" element={<Room/>}/>
                 <Route path="/roomtype" element={<Roomtype/>}/>
                 <Route path="/payment" element={<Payment/>}/>
                 <Route path="/housekeeping" element={<Housekeeping/>}/>

               
            </Routes>

            <Footer/>
            
            
        </div>
    );
}
export default App;