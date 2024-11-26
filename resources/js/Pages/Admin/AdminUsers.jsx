import { TableContext } from "@/Components/Context/TableContext";
import AdminFilters from "@/Components/Filter/AdminFilters";
import AdminForm from "@/Components/Forms/AdminForm";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Modal from "@/Components/Modal/Modal";
import Pagination from "@/Components/Pagination";
import AdminUsersTable from "@/Components/Tables/AdminUsersTable";
import { ADMIN_COLUMN, ADMIN_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_ADMIN_STATE } from "@/Library/filterState";
import { useColumnVisibility, useRequest } from "@/Library/hooks";
import { useState } from "react";

function AdminUsers({admins,queryParams={}}){
    const {isProcessing,postRequest} = useRequest();
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const { visibleColumns, onColumnChange } = useColumnVisibility(ADMIN_COLUMN);

    return(
        <>
            <div className="container-fluid p-5">
                <div className="row px-5 pt-3">
                    <div className="col-12 mb-3 d-inline-flex justify-content-between px-0">
                        <h2 className="fw-bolder">Manage Users</h2>
                        <button
                            type="button"
                            className="btn btn-primary btn-md btn-size"
                            onClick={openModal}
                        >
                            Add Admin
                        </button>
                    </div>
                    <div className="col">
                        <div className="row px-0">
                            <TableContext 
                                initialState={INITIAL_ADMIN_STATE(queryParams)} 
                                routeName={'admin.users.index'}
                                components={ADMIN_FILTER_COMPONENT}
                                column={ADMIN_COLUMN}
                            >
                                <div className="d-inline-flex justify-content-between px-0">
                                    <h5 className="m-0 align-content-center">List of admin users</h5>
                                    <AdminFilters />
                                </div>

                                <AdminUsersTable data={admins.data}
                                    visibleColumns={visibleColumns}
                                />
                                <Pagination links={admins.meta.links} />
                            </TableContext>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                    show={showModal}
                    onClose={closeModal}
                    modalTitle={"Add Admin"}
                    modalSize={'modal-md'}
                >
                    <AdminForm onClose={closeModal}/>
                </Modal>
        </>
    );
}

export default AdminContent(AdminUsers);