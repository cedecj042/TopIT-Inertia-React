import "../../../../css/admin/module.css";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import { useRequest } from "@/Library/hooks";
import EditModuleForm from "@/Components/Forms/ContentForm";

function ModuleEdit({ module, queryParams }) {
    const { isProcessing, getRequest } = useRequest();

    const handleBackClick = async () => {
        getRequest("admin.module.index", queryParams);
    };
    
    return (
        <>
            <div className="container-fluid p-5">
                <div className="row">
                    <div className="col-12 btn-toolbar mb-3">
                        <button
                            className="btn btn-transparent"
                            disabled={isProcessing}
                            onClick={handleBackClick}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <h5 className="fw-regular mb-0 align-content-center">
                            Edit Module
                        </h5>
                    </div>
                    <div className="col-12 px-5 pt-3">
                        <div className="row mb-2">
                            <EditModuleForm content={module.data} attachmentableId={module.data.module_id} attachmentableType={"Module"}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminContent(ModuleEdit);
