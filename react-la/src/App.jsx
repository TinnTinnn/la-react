import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./Pages/Layout.jsx";
import Home from "./Pages/Home.jsx";
import './App.css'
import Register from "./Pages/Auth/Register.jsx";
import Login from "./Pages/Auth/Login.jsx";
import {useContext} from "react";
import {AppContext} from "./Context/AppContext.jsx";
import Create from "./Pages/Posts/Create.jsx";
import Show from "./Pages/Posts/Show.jsx";
import Update from "./Pages/Posts/Update.jsx";
import {MantineProvider, AppShell} from "@mantine/core";
import '@mantine/core/styles.css'


export default function App() {
    const {user} = useContext(AppContext);


    return (
        <MantineProvider>
            <AppShell
                header={{height: 60}}
                padding="md"
            >
                <AppShell.Header>
                    <div>Logo</div>
                </AppShell.Header>
                <AppShell.Main>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Layout/>}>
                                <Route index element={<Home />} />
                                <Route path="/register" element={user ? <Home/> : <Register/>}/>
                                <Route path="/login" element={user ? <Home/> : <Login/>}/>
                                <Route path="/create" element={user ? <Create/> : <Login/>}/>
                                <Route path="/members/:id" element={<Show/>}/>
                                <Route path="/members/update/:id" element={user ? <Update/> : <Login/>}/>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AppShell.Main>
            </AppShell>
        </MantineProvider>);
}

