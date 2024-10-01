import React from "react";
import { useClickAway } from "react-use";
import { Navigation } from "./Navigation";
import { Link } from "react-router-dom";
import Hamburger from "hamburger-react";

export default function HamburgerMenuComponent() {
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
                                // TO-DO: Change <a> into <Link>
                                <li key={nav.title}>
                                    <a 
                                        // PPROBLEM: to/href string appending
                                        href={`/${nav.title.toLowerCase()}`}
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