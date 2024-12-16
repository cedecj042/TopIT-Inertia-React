import '../../../css/profile.css';

export default function StudentProfile({ student }) {

    const profileImageURL = student.profile_image
        ? `/storage/profile_images/${student.profile_image}`
        : '/assets/profile-circle.png';

    return (
        <>
            <div className="d-inline-flex gap-5">
                <div className="image-container">
                    <img
                        src={profileImageURL}
                        alt="Profile"
                        className="rounded-circle"
                        width="150"
                        height="150"
                    />
                </div>
                <div className="py-3 flex-grow-1">
                    <h2>
                        {student.firstname}{" "}
                        {student.lastname}
                    </h2>
                    <span>Student ID : {student.student_id}</span>
                    <hr />
                    <div className="row">
                        <h5 className="mb-3">Personal Details</h5>
                        <div className="col-7">
                            <div className="details-container">
                                <div className="detail-row">
                                    <span className="detail-key">Birthdate:</span>
                                    <span className="detail-value">{student.birthdate}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-key">Age:</span>
                                    <span className="detail-value">{student.age}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-key">Gender:</span>
                                    <span className="detail-value">{student.gender}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-key">Address:</span>
                                    <span className="detail-value">{student.address}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-key">School:</span>
                                    <span className="detail-value">{student.school}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-key">Year:</span>
                                    <span className="detail-value">{student.year}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
