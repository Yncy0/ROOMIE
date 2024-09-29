import React from "react";
import { useClickAway } from "react-use";
import { Navigation } from "./Navigation";
import Hamburger from "hamburger-react";

export default function MenuComponent() {
    const [isOpen, setIsOpen] = React.useState(false)
    const ref = React.useRef(null);

    useClickAway(ref, ()=> setIsOpen(false));

    return(
        <div ref={ref}>
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
        </div>
    )
}