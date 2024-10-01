import HeaderComponent from "./components/HeaderComponent";
import { Outlet } from "react-router-dom";


export default function Root() {
    return(
        <>
            <HeaderComponent/>
            <Outlet/>
        </>
    )
}