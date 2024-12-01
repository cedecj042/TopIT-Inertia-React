import '../../../css/profile.css';

export default function StudentProfile({ student }) {

    const profileImageURL= student.profile_image
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
                <div>
                    <h5 className="mb-3">Personal Details</h5>
                    <p>Birthdate: {student.birthdate}</p>
                    <p>Age: {student.age}</p>
                    <p>Gender: {student.gender}</p>
                    <p>Address: {student.address}</p>
                    <p>School: {student.school}</p>
                    <p>Year: {student.year}</p>
                </div>
            </div>
            </div>
        </>
    );
}
