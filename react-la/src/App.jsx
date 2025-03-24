import {BrowserRouter, Routes, Route,} from "react-router-dom";
import Layout from "./Pages/Layout.jsx";
import MemberManagement from "./Pages/Navbar/MemberManagement.jsx";
import './App.css'
import Register from "./Pages/Auth/Register.jsx";
import Login from "./Pages/Auth/Login.jsx";
import {useContext, useEffect, useState,} from "react";
import {AppContext} from "./Context/AppContext.jsx";
import Create from "./Pages/Posts/Create.jsx";
import Show from "./Pages/Posts/Show.jsx";
import Update from "./Pages/Posts/Update.jsx";
import {MantineProvider, AppShell, createTheme, Text, CloseButton,} from "@mantine/core";
import '@mantine/core/styles.css'
import {useDisclosure,} from "@mantine/hooks";
import HeaderContent from "./components/HeaderContent.jsx";
import DashboardButtons from "./Pages/Navbar/DashboardButtons.jsx";
import Overview from "./Pages/Navbar/Overview.jsx";
import Analytics from "./Pages/Navbar/Analytics.jsx";
import Saas from "./Pages/Navbar/Saas.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignature} from "@fortawesome/free-solid-svg-icons";
import ResetPasswordForm from "./Pages/Auth/ResetPasswordForm.jsx";
import AllNotifications from "./components/AllNotifications.jsx";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// ตั้งค่า Pusher และ Laravel Echo  for realtime notification
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});

export default function App() {
    const {user} = useContext(AppContext);
    const [opened, {toggle}] = useDisclosure();
    const theme = createTheme({
        breakpoints: {
            xs: '30em',
            sm: '48em',
            md: '64em',
            lg: '74em',
            xl: '90em',
        },
        fontFamily: 'Open Sans, sans-serif',
        colors: {
            primary: [
                '#E0F7FA',
                '#B2EBF2',
                '#80DEEA',
                '#4DD0E1',
                '#26C6DA',
                '#00BCD4',
                '#00ACC1',
                '#0097A7',
                '#00838F',
                '#00695C'
            ],
        },
    });

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <MantineProvider theme={theme}>
            <Notifications/>
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
                            height: 65,
                        }}
                    >
                        <HeaderContent opened={opened} toggle={toggle}/>
                    </AppShell.Header>
                    <AppShell.Navbar style={{color: 'white', backgroundColor: '#3572EF'}}
                    >
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Text style={{paddingLeft: '20px', paddingTop: '10px'}}>
                                <FontAwesomeIcon icon={faSignature}/>
                                MyMember
                            </Text>
                            {opened && screenWidth < 768 && (
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
                        <div style={{marginTop: '10px', marginLeft: '20px', marginBottom: '10px'}}>
                            Dashboard
                        </div>
                        <DashboardButtons toggle={toggle}/>
                    </AppShell.Navbar>
                    <AppShell.Main>
                        <Routes>
                            <Route path="/" element={<Layout/>}>
                                <Route index element={<Overview/>}/>
                                <Route path="/membermanagement" element={<MemberManagement/>}/>
                                <Route path="/overview" element={<Overview/>}/>
                                <Route path="/analytics" element={<Analytics/>}/>
                                <Route path="/saas" element={<Saas/>}/>
                                <Route path="/register" element={user ? <MemberManagement/> : <Register/>}/>
                                <Route path="/login" element={user ? <MemberManagement/> : <Login/>}/>
                                <Route path="/create" element={user ? <Create/> : <Login/>}/>
                                <Route path="/members/:id" element={<Show/>}/>
                                <Route path="/members/update/:id" element={user ? <Update/> : <Login/>}/>
                                <Route path="/reset-password" element={<ResetPasswordForm/>}/>
                                <Route path="/all-notificatons" element={<AllNotifications/>}/>
                            </Route>
                        </Routes>
                    </AppShell.Main>
                </AppShell>
            </BrowserRouter>
        </MantineProvider>);
}

