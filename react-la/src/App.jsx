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
import {MantineProvider, AppShell, createTheme, Text, CloseButton, Menu,} from "@mantine/core";
import '@mantine/core/styles.css'
import {useDisclosure} from "@mantine/hooks";
import HeaderContent from "./components/HeaderContent.jsx";


export default function App() {
    const {user} = useContext(AppContext);
    const [opened, {toggle}] = useDisclosure();
    const theme = createTheme({
        fontFamily: 'Open Sans, sans-serif',
        primaryColor: 'cyan',
    })


    return (
        <MantineProvider>
            <BrowserRouter>
                <AppShell
                    // header={{height:70}}
                    navbar={{
                        width: 300,
                        breakpoint: 'sm',
                        collapsed: {mobile: !opened},
                    }}
                    theme={theme}
                    padding="md"
                >
                    <AppShell.Header
                        style={{
                            borderBottom: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        <HeaderContent opened={opened} toggle={toggle}/>
                    </AppShell.Header>
                    <AppShell.Navbar p="md" style={{color: 'white', backgroundColor: '#3572EF'}}
                    >
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Text>TinnTinn</Text>
                            {opened && (
                                <div onClick={toggle} className="close-button">
                                    <CloseButton size={24} color="white"/>
                                </div>
                            )}
                        </div>
                        <hr style={{
                            border: '1px solid  grey',
                            width: '100%',
                            marginTop: '10px',
                            marginBottom: '10px'
                        }}/>
                        <Menu trigger="hover" openDelay={100} closeDelay={400} shadow="md">
                            <Text>
                                Dashboard
                            </Text>
                            <Menu.Item>
                                Member Management
                            </Menu.Item>
                            <Menu.Item>
                                Analytics
                            </Menu.Item>
                            <Menu.Item>
                                Sass
                            </Menu.Item>
                        </Menu>

                    </AppShell.Navbar>
                    <AppShell.Main>
                        <Routes>
                            <Route path="/" element={<Layout/>}>
                                <Route index element={<Home/>}/>
                                <Route path="/register" element={user ? <Home/> : <Register/>}/>
                                <Route path="/login" element={user ? <Home/> : <Login/>}/>
                                <Route path="/create" element={user ? <Create/> : <Login/>}/>
                                <Route path="/members/:id" element={<Show/>}/>
                                <Route path="/members/update/:id" element={user ? <Update/> : <Login/>}/>
                            </Route>
                        </Routes>

                    </AppShell.Main>
                </AppShell>
            </BrowserRouter>
        </MantineProvider>);
}

