import React from 'react';
import '../../../css/modal.css';
import { useEffect } from 'react';
export default function StudentProfileModal({ student, isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]); // Run this effect whenever isOpen changes

    if (!isOpen) return null;

    const profileImageURL= student.userable.profile_image
    ? `/storage/profile_images/${student.userable.profile_image}`
    : '/assets/profile-circle.png';

    return (
        <div className={`modal ${isOpen ? 'show d-block' : ''}` + ' modal-dialog-centered modal-dialog-scrollable'}  tabIndex="1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Profile</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="d-flex flex-column align-items-start px-5">
                            <div className="image-container">
                                <img src={profileImageURL} alt="" />
                            </div>
                            <div className="py-3 w-100">
                            {student ? (
                            <div>
                                <h3 className="fw-bolder">{student ? `${student.userable.firstname} ${student.userable.lastname}` : 'Loading...'}</h3>
                                <p><strong>Student ID:</strong> {student.userable.student_id}</p>
                                <p><strong>School:</strong> {student.userable.school}</p>
                                <p><strong>Year:</strong> {student.userable.year}</p>
                                <p><strong>Created At:</strong> {student.created_at}</p>
                                <p><strong>Email:</strong> {student.email}</p>
                                <p><strong>Address:</strong> {student.userable.address}</p>
                            </div>
                        ) : (
                            <p>Loading student information...</p>
                        )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
