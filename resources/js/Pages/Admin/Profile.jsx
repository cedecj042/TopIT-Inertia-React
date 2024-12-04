import AdminForm from "@/Components/Forms/AdminForm";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Modal from "@/Components/Modal/Modal";
import { useState } from "react";

function Profile({admin}) {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <>
            <div className="container-fluid p-5">
                <div className="row pt-3">
                    <div className="col-12 mb-3 d-inline-flex justify-content-between px-0">
                        <h2 className="fw-bolder">Admin Profile</h2>
                        <button
                            type="button"
                            className="btn btn-primary btn-md btn-size"
                            onClick={openModal}
                        >
                            Edit Profile
                        </button>
                    </div>
                    <div className="col">
                        <div className="row px-0">
                            {/* <AdminProfile admin={admin}/> */}
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
                {/* <AdminForm onClose={closeModal} /> */}
            </Modal>
        </>
    );
}

export default AdminContent(AdminUsers);