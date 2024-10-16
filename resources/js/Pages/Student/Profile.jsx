import StudentProfile from "@/Components/Profile/StudentProfile";
import StudentLayout from "@/Layouts/StudentLayout"; 

export default function Profile ({title,student}){
    return (
        <StudentLayout title={title}>
                <div className="row p-3">
                    <div className="row mt-4 px-5">
                        <h3 className="fw-bold">Your Profile</h3>
                    </div>
                </div>
                    <div className="row mt-4 px-5">
                        <div className="d-flex justify-content-between flex-column flex-wrap flex-md-nowrap align-items-start p-5 mb-3">
                            <StudentProfile student={student.data}/>
                            <hr />
                        </div>
                    </div>
        </StudentLayout>
    );
};


