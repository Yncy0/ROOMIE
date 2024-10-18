

export default function ColumnCard(props) {
    return(
        <div className="flex flex-col justify-between p-4 w-80 bg-white shadow-xl rounded-md">
            <div className="flex flex-col text-right">
                <span>{props.header}</span>
                <h2>{props.stats}</h2>
            </div>
            <p><span>{props.percent}</span>{props.description}</p>
        </div>
    )
}