import HeaderComponent from "../components/HeaderComponent";
import { Outlet } from "react-router";
import NavBarComponent from "../components/navigation/NavBarComponent";

export default function Root() {
  return (
    <div className="flex flex-row ">
      <NavBarComponent />
      <main className="flex flex-col gap-4 w-full">
        <HeaderComponent />
        <Outlet />
      </main>
    </div>
  );
}
