


export default function DashboardCard(props) {
    return(
        <div className="dashboard-card round-box">
            <h2>{props.header}</h2>
            <p>{props.description}</p>
        </div>
    )
}