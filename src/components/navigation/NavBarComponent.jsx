import React from "react";
import { Navigation } from "./Navigation";
import { Link } from "react-router-dom";

export default function NavBarComponent() {
    return(
        <nav className="menu-container">
            <ul className="menu-list">
                {Navigation.map((nav) => {
                    return(
                        <li key={nav.title}>
                            <Link 
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