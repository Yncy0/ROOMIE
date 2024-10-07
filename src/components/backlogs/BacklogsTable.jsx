import React, {useState} from "react"

export function BacklogsTable() {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [logs, setLogs] = useState("");
    const [list, setList] = useState([]);

    return(
        //TO-DO: Fix the variable later
        <div className="flex flex-col gap-4 round-box">
            <ol>
                {list.map((element, index) => {
                    <li className="flex flex-row" key={index}>
                        
                    </li>
                })}
            </ol>
        </div>
    )
}