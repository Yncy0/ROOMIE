import HeaderComponent from "./components/HeaderComponent";
import { Outlet } from "react-router-dom";
import NavBarComponent from "./components/navigation/NavBarComponent";


export default function Root() {
    return(
        <>
            <div className="root-div">
                <NavBarComponent/>
                <div className="root-column">
                    <HeaderComponent/>
                    <Outlet/>     
                </div>
            </div>
            {/* <NavBarComponent/> */}
        </>
    )
}