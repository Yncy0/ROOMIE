import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import { LucideFilter,  } from "lucide-react";



export default function DashbaordTable() {
    const [rooms, setRooms] = React.useState([{
        picture: "",
        name: "",
        booked: 0,
        canceled: 0,
    }]);
    // const [roomName, setRoomName] = useState("");

    React.useEffect(() => {
        //DUMMY Data
        setRooms([
            {  
            picture: "src/assets/dummy/image - product.png", 
            name: "St. Agustine(SA) 402", 
            booked: 0,
            canceled: 0
            },
            {  
            picture: "src/assets/dummy/image - product.png", 
            name: "St. Agustine(SA) 402", 
            booked: 0,
            canceled: 0
            },
            {  
            picture: "src/assets/dummy/image - product.png", 
            name: "St. Agustine(SA) 402", 
            booked: 0,
            canceled: 0
            },
            {  
            picture: "src/assets/dummy/image - product.png", 
            name: "St. Agustine(SA) 402", 
            booked: 0,
            canceled: 0
            },
            {  
            picture: "src/assets/dummy/image - product.png", 
            name: "St. Agustine(SA) 402", 
            booked: 0,
            canceled: 0
            },
        ]);
    }, [])

    return(
        <div className="flex flex-col p-6 bg-white shadow-xl rounded-md gap-8 font-roboto">
            <div className="flex flex-row justify-between">
                <h1 className="font-bold">Top Booked Rooms</h1>
                <div className="flex flex-row gap-4 items-end">
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <input type="text" placeholder="Search..." className="input-search min-w-40"/>
                    <button className="flex flex-row items-center gap-2 p-1 border-solid border-[#E6E6E6] border-2 rounded-lg">
                        <LucideFilter width={"16px"}/>
                        Filter
                    </button>
                </div>
            </div>
            <div className="flex flex-row justify-between font-bold text-sm text-gray-400">
                <h3>Rooms</h3>
                <div className="flex flex-row gap-48">
                    <h3 className="text-center">Times Booked</h3>
                    <h3>Cancelled</h3>
                </div>
            </div>
            <ul className="flex flex-col gap-4">
                {rooms.map((element, index) => (
                    <li key={index} className="flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center gap-4">
                            <img src={element.picture} alt="" />
                            <p>{element.name}</p>
                        </div>
                        <div className="flex flex-row gap-72">
                            <p>{element.booked}</p>
                            <p>{element.canceled}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}