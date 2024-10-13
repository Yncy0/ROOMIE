import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LucideFilter } from "lucide-react";

export default function UsersPage() {
    return(
        <div className="flex flex-col mx-20 mt-6">
            <div className="flex flex-row justify-between">
                <div className="flex gap-4">
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <input type="text" placeholder="Search" className="input-search min-w-[500px]"/>
                    <button className="flex flex-row items-center gap-2 text-sm px-4 border-solid border-[#E6E6E6] border-2 bg-white rounded-lg">
                        <LucideFilter width={"16px"}/>
                        Filter
                    </button>
                </div>
                <button className="bg-[#6EB229] text-white text-sm py-2 px-8 rounded-[50px]">Add User</button>
            </div>
            {/* TO-DO: ADD HEADER */}
            <div className="flex flex-col round-box gap-4">
                
            </div>
        </div>
    )
}