import Table from "./Table";
import { useRequest } from "@/Library/hooks";

export default function AdminUsersTable({
    data,
    visibleColumns
}){
    const {isProcessing,deleteRequest} = useRequest();

    const deleteAdmin = async (event, admin_id) => {
        event.stopPropagation();
        await deleteRequest("admin.users.delete", admin_id, {});
    };
    
    
    const renderActions = (rowData) => {
        return (
            <button
                type="button"
                onClick={(e) => deleteAdmin(e, rowData.admin_id)}
                disabled={isProcessing}
                className="btn btn-outline-danger d-flex justify-content-center"
            >
                <span className="material-symbols-outlined">lock</span>Delete Admin
            </button>
        );
    };

    return(
        <Table
            data={data}
            visibleColumns={visibleColumns}
            renderActions={renderActions}
            keyField="admin_id"
        />
    )
}