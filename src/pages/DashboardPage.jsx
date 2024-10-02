import ColumnCard from "../components/dashboard/ColumnCard";
import DashboardCard from "../components/dashboard/DashboardCard";


export default function DashboardPage() {
    const header1 = "Website Views";
    const header2 = "Rooms";
    const description1 = "Last Campaign Performance";

    return(
        <div className="dashboard-container">
            <DashboardCard header={header1} description={description1}/>
            <DashboardCard header={header2} description={description1}/>
            <div className="dashboard-column-card">
                <ColumnCard header={"HELLO"}/>
                <ColumnCard header={"HELLO"}/>
                <ColumnCard header={"HELLO"}/>
            </div>
        </div>
    )

}