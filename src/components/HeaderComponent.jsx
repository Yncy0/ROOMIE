import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBell, faUser} from '@fortawesome/free-solid-svg-icons'
import HamburgerMenuComponent from './navigation/HamburgerMenuComponent'
import NavBarComponent from './navigation/NavBarComponent'

export default function HeaderComponent() {

    return(
        <>
        {/* <NavBarComponent/> */}
        <div className="header-div round-box">
            {/* <HamburgerMenuComponent/> */}
            <div className="flex-search">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input 
                    className="input-search"
                    type="text"
                    placeholder="Search"
                />
            </div>
            <div className="flex-end">
                <FontAwesomeIcon icon={faBell} />
                <FontAwesomeIcon icon={faUser} />
                <p className='user-name' id='user-name'>Hello! User</p>
            </div>
        </div>
        </>
    )
}