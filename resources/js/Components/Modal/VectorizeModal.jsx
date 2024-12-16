import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import VectorForm from "../Forms/VectorForm";


export default function VectorizeModal({ showModal, closeModal }) {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (showModal) {
            const fetchCourses = async () => {
                try {
                    const response = await axios.get(route('admin.module.courses'));
                    setCourses(response.data.courses);
                } catch (error) {
                    console.error("Failed to fetch courses with modules:", error);
                }
            };
            fetchCourses();
        }
    }, [showModal]);

    return (
        <Modal
            show={showModal}
            onClose={closeModal}
            modalTitle="Vectorize Module"
            modalSize="modal-xl"
        >
            <VectorForm courses={courses} closeModal={closeModal} />
        </Modal>
    );
}
