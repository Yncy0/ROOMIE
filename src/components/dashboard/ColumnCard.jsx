

export default function ColumnCard(props) {
    return(
        <div className="column-card round-box">
            <img src="" alt="" />
            <h1>{props.header}</h1>
            <h2>{props.stats}</h2>
        </div>
    )
}