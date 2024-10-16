import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import "../../../css/student/welcome.css"; // Import the CSS for background and styles
import "../../../css/students.css"; // Import additional styles if needed

const PretestFinish = ({ score, totalQuestions, pretestId }) => {
    return (
        <MainLayout>
            <Navbar />

            <div className="container-fluid">
                <div className="row align-items-center" style={{ height: 'calc(100vh - 100px)' }}>
                    <div className="col-md-4 text-center" style={{ marginLeft: '15rem', marginRight: '-10rem' }}>
                        <img 
                            src="/assets/postpretest.svg" 
                            alt="Image" 
                            className="img-fluid" 
                        />
                    </div>
                    <div className="col-md-6 offset-md-1">
                        <div className="pe-md-5">
                            <h2 className="mb-4">Assessment Completed!</h2>
                            <p className="fs-5">
                                You got a score of <strong>{score}/{totalQuestions}</strong>.
                                Thank you for taking our assessment test. <br />
                                You may now proceed to TopIT. Happy reviewing!
                            </p>
                            <Link href="/dashboard" className="btn btn-primary w-50 p-2 mt-4">
                                Proceed to Dashboard
                            </Link>
                            <Link 
                                href={`/pretest/review/${pretestId}`} 
                                className="btn btn-outline-primary w-50 p-2 mt-2 hover:bg-transparent hover:text-primary"
                            >
                                Review your answers
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                    .btn-outline-primary:hover {
                        background-color: transparent !important;
                        color: #0d6efd !important;
                    }
                `}
            </style>
        </MainLayout>
    );
};

export default PretestFinish;
