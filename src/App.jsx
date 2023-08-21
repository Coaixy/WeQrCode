import NavBar from "./Components/NavBar.jsx";
import {useEffect, useState} from "react";
import Create from "./Components/Create.jsx";
import Change from "./Components/Change.jsx";
import QrCode from "./Components/QrCode.jsx";

export default function App() {
    const [hashTag,setHashTag] = useState(window.location.hash)
    useEffect(() => {
        if (window.location.hash === ""){
            window.location.hash = "#create"
        }


        const handleHashChange = () => {
            console.log('当前片段标识:', window.location.hash);
            setHashTag(window.location.hash)
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const mainView = () => {
        if(hashTag === "#create"){
            return <Create></Create>
        }
        else if(hashTag === "#change"){
            return <Change></Change>
        }
        else if(hashTag.includes("#code")){
            return <QrCode></QrCode>
        }
    }
    return (
        <>
            <NavBar hashTag = {hashTag}></NavBar>
            <div>
                {mainView()}
            </div>
        </>
    );
}

