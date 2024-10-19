import { AdminContent } from "@/Components/Content/AdminContent";
import ModuleFilters from "@/Components/Filter/ModuleFilters";
import ModuleForm from "@/Components/Forms/ModuleForm";
import Modal from "@/Components/Modal";
import { useColumnVisibility } from "@/Library/hooks";
import { useState } from "react";


function Module({ title, modules, queryParams }) {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const { visibleColumns, onColumnChange } =
    useColumnVisibility(COURSE_COLUMN);

    return (
        <>
            {/* <div className="container">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-5 pb-2 mt-3 mb-3">
                    <h1 className="h3 fw-semibold m-0">Modules</h1>
                    <div className="btn-toolbar mb-2 mb-md-0 ">
                        <a
                            href="{{route('admin.modules.vector.show')}}"
                            className="btn btn-primary btn-md me-2"
                        >
                            Vectorize
                        </a>
                    </div>
                </div>
                <h4 className="fw-bold">List of Modules</h4>
            </div> */}
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
                        <ModuleFilters
                            queryParams={queryParams}
                            visibleColumns={visibleColumns}
                            onColumnChange={onColumnChange}
                        />
                        <CourseTable
                            data={courses.data}
                            visibleColumns={visibleColumns}
                        />
                        <Pagination links={courses.meta.links} />
                    </div>
                </div>

                <Modal show={showModal}
                    onClose={closeModal}
                    modalTitle={"Vectorize Module"}
                    modalSize={"modal-lg"}
                >
                    <ModuleForm onClose={closeModal} />
                </Modal>
            </div>
        </>
    );
}

export default AdminContent(Module);
