import React, { Fragment } from "react";
import Hero from "../components/Hero";
import Content from "../components/Content";
import { useAuth0 } from "@auth0/auth0-react";



const IdPHome = () => {
    
    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
        } = useAuth0();
    
    loginWithRedirect({
        connection:"OktaSAML"
    })    
    
    return (    
        <Fragment>
            <Hero />
            <hr />
            <Content />
        </Fragment>
)};

export default IdPHome;
