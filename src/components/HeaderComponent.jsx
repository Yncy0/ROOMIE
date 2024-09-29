import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBell, faUser, faBars } from '@fortawesome/free-solid-svg-icons'
import MenuComponent from './navigation/MenuComponent'

export default function HeaderComponent() {
    return(
        <div className="header-div">
            {/* <button className="button-burger-menu">
                <FontAwesomeIcon icon={faBars}/>
            </button> */}
            <MenuComponent/>
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
    )
}