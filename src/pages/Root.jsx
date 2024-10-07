import HeaderComponent from "../components/HeaderComponent";
import { Outlet } from "react-router-dom";
import NavBarComponent from "../components/navigation/NavBarComponent";


export default function Root() {
    return(
        <>
            <div className="flex flex-row gap-4 m-4">
                <NavBarComponent/>
                <div className="flex flex-col gap-4">
                    <HeaderComponent/>
                    <Outlet/>     
                </div>
            </div>
            {/* <NavBarComponent/> */}
        </>
    )
}