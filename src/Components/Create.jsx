import {Button, Image, Input, Link} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import {useState} from "react";
import {CameraIcon} from "./CameraIcon.jsx";
import jsQR from "jsqr";
import "../config.js"
import {codePreview, createUrl, getImgUrl} from "../config.js";
import QRCode from "qrcode.react";

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // 将 textarea 添加到 DOM 中
    document.body.appendChild(textarea);

    // 选中文本
    textarea.select();

    // 执行复制命令
    document.execCommand('copy');

    // 移除 textarea
    document.body.removeChild(textarea);
}

function generateShortUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default function Create() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [info, setInfo] = useState("")
    const [uploadImgSrc, setUploadImgSrc] = useState("");
    const [wxSrc, setWxSrc] = useState("")
    const [isCreated, setIsCreated] = useState(true)
    const [key, setKey] = useState("233")

    function create() {
        let qrCodeImage = document.querySelector("#qrCode")
        let canvas = document.querySelector("#parse")
        let context = canvas.getContext("2d")
        canvas.width = qrCodeImage.width;
        canvas.height = qrCodeImage.height;
        context.drawImage(qrCodeImage, 0, 0, qrCodeImage.width, qrCodeImage.height);

        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        try {
            let code = jsQR(imageData.data, imageData.width, imageData.height);
            let wxUrl = code.data
            let uuid = generateShortUUID()
            console.log(uuid);

            const options = {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                body: JSON.stringify({
                    uuid: uuid,
                    wxUrl: wxUrl,
                    auth: document.querySelector("#auth").value
                })
            }
            fetch(createUrl, options).then(
                response => response.json()
            ).then(
                data => {
                    console.log(data)

                    setIsCreated(false)
                    if(data.code === '201'){
                        setWxSrc(data.data)
                        setInfo(data.data)
                        onOpen()
                    }else{
                        setKey(data.data)
                        const params = {
                            token: uuid
                        };
                        const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
                        const fullUrl = `${getImgUrl}?${queryString}`;
                        // 发送GET请求
                        fetch(fullUrl)
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                setWxSrc(data.url)
                                setInfo("二维码链接已复制")
                                onOpen()
                                copyToClipboard(codePreview + uuid)
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                }
            ).catch(
                error => {
                    console.log(error)
                }
            )
        } catch (e) {
            setInfo("未能成功解析二维码")
            onOpen()
        }
    }

    return (
        <>
            <div
                className="grid md:grid-cols-3 md:grid-rows-2 sm:grid-cols-1 sm:grid-rows-5 place-items-center space-y-4">
                <div className="col-start-1 row-start-1">
                    <Image
                        id="qrCode"
                        width="160px"
                        height="160px"
                        alt="你的微信群二维码"
                        src={uploadImgSrc}
                    />
                    <Input type="text" label="Auth" id="auth"/>
                </div>
                <div className="col-start-1 row-start-2 text-center">
                    <Button color="primary" endContent={<CameraIcon/>} onClick={() => {
                        document.querySelector("#uploadInput").click()
                    }}>
                        上传二维码
                    </Button>
                    <div className="mt-4">
                        已经有Token?
                        <Link href="#change">更新</Link>
                    </div>
                </div>
                <div className="md:col-start-2 md:row-span-2">
                    <Button color="primary" onClick={create}>
                        创建
                    </Button>
                </div>
                <div className="md:col-start-3" hidden={isCreated}>
                    <QRCode value={wxSrc} size={128}/>
                </div>
                <div className="md:row-start-2 md:col-start-3 " hidden={isCreated}>
                    <Input
                        id="key"
                        isReadOnly
                        type="text"
                        label="验证密钥"
                        endContent="复制"
                        value={key}
                        className="max-w-xs"
                        onClick={() => {
                            copyToClipboard(document.querySelector("#key").value)
                        }}
                    />
                </div>
            </div>
            <div className="hidden">
                <input id="uploadInput" type="file" accept="image/jpeg,image/png" onChange={() => {
                    setUploadImgSrc(URL.createObjectURL(document.querySelector("#uploadInput").files[0]))
                }}></input>
                <canvas id="parse"></canvas>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">信息</ModalHeader>
                                <ModalBody>
                                    <p>
                                        {info}
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onPress={onClose}>
                                        好的
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}