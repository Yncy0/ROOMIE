import BarChartComponent from "@/components/dashboard/barChart";
import ColumnCard from "../components/dashboard/ColumnCard";
import DashbaordTable from "@/components/dashboard/DashboardTable";


export default function DashboardPage() {
    const header1 = "Website Views";
    const header2 = "Rooms";
    const description1 = "Last Campaign Performance";

    return(
        <>
            <div className="dashboard-container">
                <BarChartComponent />
                <BarChartComponent />
                <div className="dashboard-column-card">
                    <ColumnCard header={"HELLO"} stats={287} percent={"+3%"} description={"more than last week"}/>
                    <ColumnCard header={"HELLO"} stats={287} percent={"+3%"} description={"more than last week"}/>
                    <ColumnCard header={"HELLO"} stats={287} percent={"+3%"} description={"more than last week"}/>            
                </div>
                
            </div>
            <DashbaordTable />
        </>
    )

}