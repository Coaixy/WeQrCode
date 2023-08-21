import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    NavbarMenuToggle,
    NavbarMenu, NavbarMenuItem
} from "@nextui-org/react";
import Wc_NavBarItem from "./Wc_NavBarItem.jsx";

export default function NavBar(props) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        "生成",
        "修改",
        "管理",
    ];

    const menuItemsHref = [
        "#create",
        "#change",
        "#manage"
    ]
    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <p className="font-bold text-inherit">WeQrCode</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <Wc_NavBarItem href="#create" hashTag={props.hashTag} name="创建"></Wc_NavBarItem>
                <Wc_NavBarItem href="#change" hashTag={props.hashTag} name="更新"></Wc_NavBarItem>
                <Wc_NavBarItem href="#manage" hashTag={props.hashTag} name="管理"></Wc_NavBarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        官方交流群
                    </Button>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            color={
                                props.hashTag === menuItemsHref[index] ? "" : "foreground"
                            }
                            className="w-full"
                            href={menuItemsHref[index]}
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
