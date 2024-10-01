import React from "react";
import { Navigation } from "./Navigation";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function NavBarComponent() {
    return(
        <nav className="menu-container round-box">
            <ul className="menu-list">
                {Navigation.map((nav) => {
                    const {Icon} = nav
                    return(
                        <li key={nav.title}>
                            <Link 
                                to={`/${nav.title.toLowerCase()}`}
                                onClick={() => setIsOpen((prev) => !prev)}
                            >   
                                <FontAwesomeIcon icon={Icon} />
                                {/* <span>{nav.title}</span> */}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}