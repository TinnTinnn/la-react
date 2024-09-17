import {BrowserRouter, Routes, Route} from "react-router-dom";

import Layout from "./Pages/Layout.jsx";
import Home from "./Pages/Home.jsx";
import './App.css'
import Register from "./Pages/Auth/Register.jsx";
import Login from "./Pages/Auth/Login.jsx";

export default function App() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>

                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
            </Route>
        </Routes>
    </BrowserRouter>;
}

