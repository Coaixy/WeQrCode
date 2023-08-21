import {useEffect, useState} from "react";
import QRCode from "qrcode.react";
import {getImgUrl} from "../config.js";


export default function QrCode() {
    let token = window.location.href.split("?token=")[1]
    const [value, setValue] = useState("WeQrCode")

    useEffect(() => {
        const params = {
            token: token
        };
        const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
        const fullUrl = `${getImgUrl}?${queryString}`;
        // 发送GET请求
        fetch(fullUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setValue(data.url)
            })
            .catch(error => {
                console.error(error);
            });
    }, [])
    return (<>
        <div className="flex items-center justify-center h-screen" hidden={value !== "WeQrCode"}>
            <QRCode value={value} size={256}/>
        </div>
        <div className="hidden">
        </div>
    </>)
}