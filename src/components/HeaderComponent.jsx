import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBell, faUser} from '@fortawesome/free-solid-svg-icons'
import HamburgerMenuComponent from './navigation/HamburgerMenuComponent'
import NavBarComponent from './navigation/NavBarComponent'

export default function HeaderComponent() {

    return(
        <>
        {/* <NavBarComponent/> */}
        <header className="header-div bg-white">
            {/* <HamburgerMenuComponent/> */}
            <div className="flex flex-row items-center gap-4">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input 
                    className="input-search min-w-[500px]"
                    type="text"
                    placeholder="Search"
                />
            </div>
            <div className="flex flex-row items-center gap-8">
                <FontAwesomeIcon icon={faBell} />
                <FontAwesomeIcon icon={faUser} />
                <p id='user-name'>Hello! User</p>
            </div>
        </header>
        </>
    )
}