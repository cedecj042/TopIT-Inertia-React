import Table from "./Table";
import { useContext, useState } from "react";
import ContextProvider from "../Context/TableContext";
import { useRequest, useSortState } from "@/Library/hooks";
import DeleteForm from "../Forms/DeleteForm";
import Modal from "../Modal/Modal";
import { toast } from "sonner";

export default function ModuleTable({ data, queryParams }) {
    const keyField = "module_id";
    const { state, dispatch, visibleColumns } = useContext(ContextProvider);
    const { toggleTableSort } = useSortState(dispatch);
    const { isProcessing, getRequest, deleteRequest } = useRequest();
    const [selectedModule, setSelectedModule] = useState();

    const [showModal, setShowModal] = useState(false);
    const openModal = (module) => {
        setSelectedModule(module); // Store the module ID to delete
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);


    const renderActions = (rowData) => {
        return (
            <>
                <div className="d-inline-flex gap-2">
                    <button
                        onClick={(e) => editModule(e, rowData.module_id)}
                        className="btn btn-outline-primary d-flex justify-content-center align-items-left"
                    >
                        <span className="material-symbols-outlined align-self-center">
                            edit_square
                        </span>{" "}
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            openModal(rowData);
                        }}
                        className="btn btn-outline-danger d-flex justify-content-center align-items-left"
                    >
                        <span className="material-symbols-outlined align-self-center">
                            delete
                        </span>{" "}
                        Delete
                    </button>
                </div>
            </>
        );
    };

    const editModule = (e, module_id) => {
        e.stopPropagation();
        getRequest("admin.module.edit", module_id, {});
    };

    const deleteModule = (module_id) => {
        deleteRequest("admin.module.delete", module_id, {
            onSuccess:()=>{
                toast.success("Module deleted successfully.");
                closeModal();
            },
            onError: (error) => {
                toast.error("Error deleting module");
            },
        });
    };

    const viewModule = (e, module) => {
        e.preventDefault();
        getRequest("admin.module.detail", { id: module.module_id, ...queryParams }, {});
    };

    return (
        <>
            <Table
                data={data}
                isRowClickable={true}
                sortState={state.sortState}
                changeSort={toggleTableSort}
                handleClick={viewModule}
                visibleColumns={visibleColumns}
                renderActions={renderActions}
                keyField={keyField}
            />
            <Modal
                show={showModal}
                onClose={closeModal}
                modalTitle={"Delete Module"}
            >
                {selectedModule && (
                    <DeleteForm
                        title={selectedModule.title}
                        onClose={closeModal}
                        onDelete={() => deleteModule(selectedModule.module_id)}
                        isProcessing={isProcessing}
                    />
                )}
            </Modal>
        </>
    );
}
