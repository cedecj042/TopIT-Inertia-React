import HighLowChart from "@/Components/Chart/HighLowChart";
import { AdminContent } from "@/Components/LayoutContent/AdminContent"

function Reports({highlowData}){
    return(
        <>
            <HighLowChart data={highlowData} />
        </>
    )
}

export default AdminContent(Reports);