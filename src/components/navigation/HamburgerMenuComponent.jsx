import React from "react";
import { useClickAway } from "react-use";
import { Navigation } from "./Navigation";
import { Link } from "react-router-dom";
import Hamburger from "hamburger-react";
import NavBarComponent from "./NavBarComponent";

export default function HamburgerMenuComponent() {
    const [isOpen, setIsOpen] = React.useState(false)
    const ref = React.useRef(null);

    useClickAway(ref, ()=> setIsOpen(false));

    return(
        <div ref={ref}>
            <Hamburger size={24} toggle={setIsOpen} toggled={isOpen}/> 
            { isOpen &&(
                    <NavBarComponent/>
                )
            }
        </div>
    )
}