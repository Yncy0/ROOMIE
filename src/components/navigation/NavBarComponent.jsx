import React from "react";
import { Navigation } from "./Navigation";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronFirst, ChevronLast } from "lucide-react";
// import { SidebarContext } from "react-pro-sidebar";


export default function NavBarComponent() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeLink, setActiveLink] = React.useState(null);

    const openSideBar = () => {
        setIsOpen(!isOpen)
    }

    const handleClick = (index) => {
        setActiveLink(index)
    }

    return(
        <div className={`menu-container round-box pt-14 gap-9 items-center duration-300 ease-in-out ${isOpen ? 'w-32' : 'w-52'}`}>
            <div className="flex flex-row items-center justify-center gap-4 mb-7 min-w-full">
                <button onClick={openSideBar} className=" py-2">
                    {isOpen ? <ChevronLast className="min-w-6"/> : <ChevronFirst className="min-w-6"/>}
                </button>
                <h1 className={`${!isOpen ? "block" : "hidden"} font-righteous text-xl`}>ROOMIE</h1>
            </div>
            <ul className="flex flex-col gap-8 items-start">
                {Navigation.map((nav, index) => {
                    const {Icon} = nav
                    return(
                        <li key={nav.title} className="min-w-full">
                            <Link 
                                to={`/${nav.title.toLowerCase()}`}
                                onClick={() => handleClick(index)}
                                className={`flex flex-row items-center p-2 px-6 gap-4 hover:bg-gray-100 rounded-lg 
                                            ${activeLink === index ? "bg-[#2B32B2] text-white pointer-events-none" : "bg-white text-black"}`}
                            >   
                                <FontAwesomeIcon icon={Icon}/>
                                <span className={` ${!isOpen ? "block" : "hidden"}`}>{nav.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}