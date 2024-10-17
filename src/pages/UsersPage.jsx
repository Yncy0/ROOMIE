import React from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LucideFilter } from "lucide-react";
import { UserDuummy } from "@/components/users/userDummy";

export default function UsersPage() {
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        setUsers([...UserDuummy])
    }, [])

    return(
        <div className="flex flex-col mx-20 mt-6 gap-8">
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
            {/* TO-DO: TABLE!!!!!!!*/}
            <div className="flex flex-col round-box gap-4 p-6">
                <ul className="flex flex-col gap-4">
                <li className="flex flex-row justify-between gap-48">
                        <h1>Name</h1>
                        <h1>Email</h1>
                        <h1>Role</h1>
                        <h1>Password</h1>
                        <h1>Last Login</h1>
                        <h1>Edit User</h1>
                        <h1>Delete User</h1>
                    </li>
                    {users.map((element, index) => (
                        <li key={index} className="flex flex-row justify-between">
                            <p>{element.name}</p>
                            <p>{element.email}</p>
                            <p>{element.role}</p>
                            <p>{element.password}</p>
                            <p>{element.lastLogin}</p>
                            <button>Edit</button>
                            <button>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}