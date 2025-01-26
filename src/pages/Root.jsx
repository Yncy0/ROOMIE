import HeaderComponent from "../components/HeaderComponent";
import BodyComponent from "../components/BodyComponent";
import { Outlet } from "react-router-dom";
import NavBarComponent from "../components/navigation/NavBarComponent";


export default function Root() {
    return(
        <div className="flex flex-row ">
            <NavBarComponent/>
            <main className="flex flex-col gap-4 w-full">
                <BodyComponent/>  
            </main>
        </div>       
    )
}