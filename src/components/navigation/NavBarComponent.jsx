import React from "react";
import { useClickAway } from "react-use";
import { Navigation } from "./Navigation";
import { Link } from "react-router-dom";
import Hamburger from "hamburger-react";


export default function NavBarComponent() {
    return(
    <nav className="menu-container">
        <h1>ROOMIE</h1>
        <ul className="menu-list">
            {Navigation.map((nav) => {
                return(
                    // TO-DO: Change <a> into <Link>
                    <li key={nav.title}>
                        <Link 
                            // PPROBLEM: to/href string appending
                            to={`/${nav.title.toLowerCase()}`}
                            onClick={() => setIsOpen((prev) => !prev)}
                        >
                            {nav.title}
                        </Link>
                    </li>
                )
            })}
        </ul>
    </nav>
    )
}