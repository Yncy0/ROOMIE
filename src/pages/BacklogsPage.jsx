import React, {useState} from "react"
import { backlogsDummy } from "@/components/backlogs/backlogsDummy";


export default function BacklogsPage() {
    const [backlogs, setBacklogs] = React.useState([]);

    React.useEffect(() => {
        setBacklogs([...backlogsDummy])
    }, [])

    return(
        //TO-DO: Fix the variable later
        <div className="flex flex-col gap-4 round-box">
            <ul>
               {backlogs.map((element, index) => (
                    <li className="flex flex-row justify-around" key={index}>
                        <p>{element.date}</p>
                        <p>{element.logs}</p>
                        <p>{element.time}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}