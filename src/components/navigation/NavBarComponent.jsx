import React, { useContext } from "react";
import { Navigation } from "./Navigation";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
// import { SidebarContext } from "react-pro-sidebar";


export default function NavBarComponent() {
    const [isOpen, setIsOpen] = React.useState(false);

    const openSideBar = () => {
        setIsOpen(!isOpen)
    }

    return(
        <div className="menu-container round-box p-6 gap-9 bg-white">
            <div className="flex flex-row items-center gap-4">
                <button onClick={openSideBar}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <h1 className={`${!isOpen ? "block" : "hidden"} font-righteous text-xl`}>ROOMIE</h1>
            </div>
            <ul className="flex flex-col gap-12 pb-64">
                {Navigation.map((nav) => {
                    const {Icon} = nav
                    return(
                        <li key={nav.title}>
                            <Link 
                                to={`/${nav.title.toLowerCase()}`}
                                // onClick={() => setIsOpen((prev) => !prev)}
                                className="flex flex-row items-center gap-4"
                            >   
                                <FontAwesomeIcon icon={Icon} />
                                <span className={!isOpen ? "block" : "hidden"}>{nav.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}