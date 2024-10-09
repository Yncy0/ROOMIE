import BarChartComponent from "@/components/dashboard/barChart";
import ColumnCard from "../components/dashboard/ColumnCard";
import DashbaordTable from "@/components/dashboard/DashboardTable";
import { LineChartComponent } from "@/components/dashboard/lineChart";


export default function DashboardPage() {
    const header1 = "Website Views";
    const header2 = "Rooms";
    const description1 = "Last Campaign Performance";

    return(
        <div className="flex flex-col m-20 gap-6">
            <div className="flex flex-row justify-between">
                <BarChartComponent />
                <LineChartComponent />
                <div className="flex flex-col gap-8">
                    <ColumnCard header={"Bookins"} stats={287} percent={"+3%"} description={"more than last week"}/>
                    <ColumnCard header={"Rooms"} stats={287} percent={"+3%"} description={"more than last week"}/>
                    <ColumnCard header={"Users"} stats={287} percent={"+3%"} description={"more than last week"}/>            
                </div>
            </div>
            <DashbaordTable />
        </div>
    )

}