

export default function NavBarComponent() {
    return(
        <nav className="menu-container">
            <h1>ROOMIE</h1>
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