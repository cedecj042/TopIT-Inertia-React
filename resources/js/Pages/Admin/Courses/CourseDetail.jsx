import { useState } from "react";
import "../../../../css/admin/dashboard.css";
import PdfTable from "@/Components/Tables/PdfTable";
import Pagination from "@/Components/Pagination";
import { useColumnVisibility, useRequest } from "@/Library/hooks";
import { PDF_COLUMN } from "@/Library/constants";
import Modal from "@/Components/Modal/Modal";
import PdfForm from "@/Components/Forms/PdfForm";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";


function CourseDetail({ title, course, pdfs, queryParams }) {

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const { visibleColumns, onColumnChange } = useColumnVisibility(PDF_COLUMN);
    
    const {isProcessing,getRequest} = useRequest();
    const handleBackClick = async () => {
        getRequest('admin.course.index',{...queryParams});
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
                            Course Detail
                        </h5>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            
                            <div className="col-12 mb-3">
                                <h2 className="fw-bolder">{course.data.title}</h2>
                                <p className="m-0">{course.data.description}</p>
                            </div>
                            <div className="col-12 btn-toolbar justify-content-between mb-3">
                                <h4 className="fw-semibold m-0 align-content-center">List of PDFs</h4>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-md btn-size"
                                    onClick={openModal}
                                >
                                    Upload Pdf
                                </button>
                            </div>
                            <div className="col-12 justify-content-between">
                                <PdfTable data={pdfs.data}
                                    visibleColumns={visibleColumns}
                                />
                                <Pagination links={pdfs.meta.links} />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    show={showModal}
                    onClose={closeModal}
                    modalTitle={"Upload Pdf"}
                >
                    <PdfForm course={course.data} onClose={closeModal} />
                </Modal>
            </div>
        </>
    );
}

export default AdminContent(CourseDetail);
