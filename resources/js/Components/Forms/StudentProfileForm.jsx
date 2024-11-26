import { useState, useEffect } from "react";

export default function StudentProfileForm({ student, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        firstname: student.firstname || "",
        lastname: student.lastname || "",
        birthdate: student.birthdate || "",
        gender: student.gender || "",
        address: student.address || "",
        school: student.school || "",
        year: student.gender || "",
    });

    console.log("form data", formData);

    useEffect(() => {
        setFormData({
            firstname: student.firstname || "",
            lastname: student.lastname || "",
            birthdate: student.birthdate || "",
            gender: student.gender || "Male",
            address: student.address || "",
            school: student.school || "",
            year: student.year ? student.year.toString() : "",
        });
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting form data:", formData);
        onSubmit(formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Birthdate</label>
                <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            {/* <div className="mb-3">
                <label className="form-label">Age</label>
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="form-control"
                />
            </div> */}
            <div className="mb-3">
                <label className="form-label">Gender</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-select"
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">School</label>
                <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Year</label>
                <select
                    name="year"
                    className="form-select"
                    value={formData.year}
                    onChange={handleChange}
                >
                    {[1, 2, 3, 4, 5, 6].map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </div>
        </form>
    );
}
