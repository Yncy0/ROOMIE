import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBell, faUser, faBars } from '@fortawesome/free-solid-svg-icons'

export default function HeaderComponent() {
    return(
        <div className="header-div">
            <div className="flex-search">
                <button className="button-burger-menu">
                    <FontAwesomeIcon icon={faBars}/>
                </button>
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
                <div className="flex-user">
                    <p className='user-name' id='user-name'>Hello! User</p>
                    <p>Admin</p>
                </div>
            </div>
        </div>
    )
}