

export default function ColumnCard(props) {
    return(
        <div className="column-card round-box">
            <img src="src\assets\bg - icon1.png" alt="" />
            <div className="column-text">
                <span>{props.header}</span>
                <h2>{props.stats}</h2>
            </div>
            <p><span>{props.percent}</span>{props.description}</p>
        </div>
    )
}