import HeaderComponent from "./components/HeaderComponent";
import { Outlet } from "react-router-dom";
import NavBarComponent from "./components/navigation/NavBarComponent";


export default function Root() {
    return(
        <>
            <HeaderComponent/>
            <Outlet/>        
        </>
    )
}