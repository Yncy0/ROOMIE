import React, {useState, useRef} from "react";
import { Navigation } from "./Navigation";
import Hamburger from "hamburger-react";

export default function MenuComponent() {
    const [isOpen, setIsOpen] = React.useState(false)

    return(
        <>
            <Hamburger size={24} toggle={setIsOpen} toggled={isOpen}/> 
            { isOpen &&(
                <nav className="menu-container">
                    <h1>ROOMIE</h1>
                    <ul className="menu-list">
                        {Navigation.map((nav) => {
                            return(
                                <li key={nav.title}>
                                    <a  href={nav.href}
                                        onClick={() => setIsOpen((prev) => !prev)}
                                    >
                                        {nav.title}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
                )
            }
        </>
    )
}