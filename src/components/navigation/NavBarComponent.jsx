import React from "react";
import { Navigation } from "./Navigation";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function NavBarComponent() {
    return(
        <nav className="flex flex-col items-center justify-center bg-white 
                        p-6 rounded-md shadow-lg text-right min-w-max sticky z-10">
            <ul className="flex flex-col gap-12 pb-64">
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