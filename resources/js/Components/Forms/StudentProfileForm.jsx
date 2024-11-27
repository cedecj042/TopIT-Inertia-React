import { useState, useEffect } from "react";

export default function StudentProfileForm({ student, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        profile_image: student.profile_image || null,
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
            profile_image: student.profile_image || null,
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

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                profile_image: e.target.files[0]
            }));
            setProfileImageChanged(true);
        }
    };

    const [profileImageChanged, setProfileImageChanged] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formDataToSubmit = new FormData();
        
        Object.keys(formData).forEach(key => {
            if ((key !== 'profile_image' || profileImageChanged) && 
                formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
                formDataToSubmit.append(key, formData[key]);
            }
        });

        for (let pair of formDataToSubmit.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        onSubmit(formDataToSubmit);
    };

    const handleCancel = () => {
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
            <div className="mb-3">
                <label className="form-label">Profile Image</label>
                <input
                    type="file"
                    name="profile_image"
                    onChange={handleFileChange}
                    className="form-control"
                    accept="image/*"
                />
            </div>
            <div className="d-flex justify-content-between mt-4">
                <button type="button" onClick={handleCancel} className="btn btn-secondary mr-2">
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </div>
        </form>
    );
}
