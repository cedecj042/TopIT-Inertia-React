import AdminLayout from "@/Layouts/AdminLayout";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import "../../../css/admin/dashboard.css";
import PdfTable from "@/Components/Tables/PdfTable";
import Pagination from "@/Components/Pagination";
import { useColumnVisibility } from "@/Library/hooks";
import { PDF_COLUMN } from "@/Library/constants";
import Modal from "@/Components/Modal";
import PdfForm from "@/Components/Forms/PdfForm";


export default function CourseDetail({ title, course, pdfs, queryParams }) {

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const { visibleColumns, onColumnChange } = useColumnVisibility(PDF_COLUMN);
    const handleBackClick = () => {
        router.get(route("admin.course.index", queryParams));
    };

    return (
        <AdminLayout title={title}>
            <div className="container-fluid p-5">
                <div className="row">
                    <div className="col btn-toolbar mb-3">
                        <button
                            className="btn btn-transparent"
                            onClick={handleBackClick}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <h5 className="fw-regular mb-0 align-content-center">
                            Course Detail
                        </h5>
                    </div>
                    <div className="row px-5 pt-3">
                        <div className="row">
                            
                            <div className="col-12 mb-3">
                                <h2 className="fw-bolder">{course.data.title}</h2>
                                <p className="">{course.data.description}</p>
                            </div>
                            <div className="col-12 btn-toolbar justify-content-between">
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
                                <PdfTable
                                    data={pdfs.data}
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
                    <PdfForm id={course.data.course_id} onClose={closeModal} />
                </Modal>
                {/* <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
                            <h1 className="h3 fw-semibold m-0">
                                {course.data.title}
                            </h1>
                            <div className="btn-toolbar mb-2 mb-md-0 ">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-md"
                                    data-bs-toggle="modal"
                                    data-bs-target="#uploadModal"
                                    style="font-size: 0.9rem; padding: 0.8em 1em"
                                >
                                    Upload Materials
                                </button>
                            </div>
                        </div> */}
            </div>
        </AdminLayout>
    );
}
