import {Link, NavbarItem} from "@nextui-org/react";
import React from "react";

export default function Wc_NavBarItem(props) {
    const hashTag = props.hashTag
    const href = props.href
    const name = props.name
    return (
        <>
            <NavbarItem isActive={hashTag === href}>
                <Link href={href} color={hashTag === href?"":"foreground"}>
                    {name}
                </Link>
            </NavbarItem>
        </>
    )
}