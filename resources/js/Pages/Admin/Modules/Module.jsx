import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import ModuleFilters from "@/Components/Filter/ModuleFilters";
import Modal from "@/Components/Modal/Modal";
import Pagination from "@/Components/Pagination";
import ModuleTable from "@/Components/Tables/ModuleTable";
import { TableContext } from "@/Components/Context/TableContext";
import { MODULE_COLUMN, MODULE_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_MODULE_STATE } from "@/Library/filterState";
import { useState } from "react";
import axios from "axios";
import VectorForm from "@/Components/Forms/VectorForm";

function Module({ title, modules, queryParams,filters }) {
    const [showModal, setShowModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const openModal = async () => {
        setShowModal(true);
        try {
            const response = await axios.get(route('admin.module.courses')); // Fetch JSON data
            setCourses(response.data.courses); // Store the data in state
        } catch (error) {
            console.error("Failed to fetch courses with modules:", error);
        }
    };
    const closeModal = () => setShowModal(false);
    return (
        <>
            <div className="container-fluid p-5">
                <div className="row justify-content-center">
                    <div className="col mb-4 btn-toolbar justify-content-between">
                        <h2 className="fw-bolder m-0">Modules</h2>
                        <button
                            type="button"
                            className="btn btn-primary btn-md btn-size"
                            onClick={openModal}
                        >
                            Vectorize
                        </button>
                    </div>
                    <div className="row justify-content-between">
                        <h5 className="fw-semibold mb-3 px-0 ">
                            List of Modules
                        </h5>
                        <TableContext 
                            initialState={INITIAL_MODULE_STATE(queryParams)}
                            routeName={"admin.module.index"}
                            components={MODULE_FILTER_COMPONENT}
                            column={MODULE_COLUMN}
                            >
                            <ModuleFilters filters={filters}/>
                            <ModuleTable data={modules.data} queryParams={queryParams}/>
                        </TableContext>
                        <Pagination links={modules.meta.links} queryParams={queryParams} />
                    </div>
                </div>

                <Modal
                    show={showModal}
                    onClose={closeModal}
                    modalTitle={"Vectorize Module"}
                    modalSize={"modal-xl"}
                >
                    <VectorForm courses={courses} closeModal={closeModal}/>
                </Modal>
            </div>
        </>
    );
}

export default AdminContent(Module);
