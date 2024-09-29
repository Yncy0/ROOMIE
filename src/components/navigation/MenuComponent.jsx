import React, {useState, useRef} from "react";
import Hamburger, { Squash } from "hamburger-react";
import { Navigation } from "./Navigation";

export default function MenuComponent() {
    const[isOpen, setIsOpen] = useState(false);

    return(
        <div className="menu-container">
            <Hamburger toggled={isOpen} toggle={setIsOpen}/> 
            {isOpen && (
                <div className="menu-open">
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
                </div>
            )}
        </div>
    )
}