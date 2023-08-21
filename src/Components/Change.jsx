import {
    Button, Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react";
import {changeUrl} from "../config.js";
import React, {useState} from "react";
import {EyeSlashFilledIcon} from "./EyeSlashFilledIcon.jsx";
import {EyeFilledIcon} from "./EyeFilledIcon.jsx";
import {CameraIcon} from "./CameraIcon.jsx";
import jsQR from "jsqr";


export default function Change() {
    const [uploadImgSrc, setUploadImgSrc] = useState("");
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [info, setInfo] = useState("")
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    function parseQrCode() {
        let qrCodeImage = document.querySelector("#changeQrCode")
        let canvas = document.querySelector("#changeParse")
        let context = canvas.getContext("2d")
        canvas.width = qrCodeImage.width;
        canvas.height = qrCodeImage.height;
        context.drawImage(qrCodeImage, 0, 0, qrCodeImage.width, qrCodeImage.height);

        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        try {
            let code = jsQR(imageData.data, imageData.width, imageData.height);
            let wxUrl = code.data
            console.log(wxUrl);
            setInfo("解析成功")
            return wxUrl
        } catch (error) {
            setInfo("二维码解析失败")
        }
        return ""
    }

    function submit() {
        const token = document.querySelector("#url").value.split("token=")[1]
        const key = document.querySelector("#key").value

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                key: key,
                wxUrl: parseQrCode()
            })
        }

        fetch(changeUrl, options).then(
            response => response.json()
        ).then(
            data => {
                console.log(data)
                switch (data.code) {
                    case 200: {
                        setInfo("修改成功")
                        break
                    }
                    case 201: {
                        setInfo("token不存在")
                        break
                    }
                    case 202: {
                        setInfo("密钥错误")
                        break
                    }
                    default: {
                        setInfo("未知错误")
                    }
                }
                onOpen()
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    return (
        <div className="grid grid-rows-5 place-items-center">
            <div>
                <h1 className="font-bold">
                    更新二维码数据
                </h1>

            </div>
            <div>
                <Button color="primary" endContent={<CameraIcon/>} onClick={() => {
                    document.querySelector("#changeInput").click()
                }}>
                    上传二维码
                </Button>
            </div>
            <div>
                <Input
                    id="url"
                    isRequired
                    type="text"
                    label="你的链接"
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">https://</span>
                        </div>
                    }
                    className="max-w-md"
                />
            </div>
            <div className="mt-4">
                <Input
                    id="key"
                    isRequired
                    type={isVisible ? "text" : "password"}
                    label="对应密钥"
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                            )}
                        </button>}
                    className="max-w-xs"
                />
            </div>
            <div>
                <Button color="primary" onClick={submit}>
                    确认修改
                </Button>
            </div>
            <Image
                id="changeQrCode"
                width="160px"
                height="160px"
                alt="你的微信群二维码"
                src={uploadImgSrc}
            />
            <div className="hidden">
                <div className="hidden">
                    <input id="changeInput" type="file" accept="image/jpeg,image/png" onChange={() => {
                        setUploadImgSrc(URL.createObjectURL(document.querySelector("#changeInput").files[0]))
                        setTimeout(() => {

                            parseQrCode()
                            onOpen()
                        }, 1200)
                    }}></input>
                    <canvas id="changeParse"></canvas>
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
            </div>
        </div>
    )
}