import { useForm } from '@inertiajs/react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import '../../../css/admin.css';

export default function Login() {

    const {data,setData,post,processing,errors} = useForm({
        'username':'',
        'password':'',
    });

    const formRef = useRef(null);

    useEffect(() => {
        const elements = formRef.current.querySelectorAll('.stagger-item');
        
        // GSAP stagger animation
        gsap.from(elements, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out',
        });
    }, []);
    
    function handleSubmit(e) {
        e.preventDefault(); // Prevent default browser behavior
        post(route('admin.login')); // Use Inertia's post method to submit the form
    }
    return (
        <div className="container-fluid vh-100 admin-bg">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-md-3 col-lg-3">
                    <div className="card-body">
                        <h2 className="text-center mb-4">
                            <img
                                src="/assets/logo.svg"
                                alt="TopIT Logo"
                                width="150"
                                height="50"
                            />
                        </h2>
                        <form onSubmit={handleSubmit} ref={formRef}>
                            <div className="mb-1 input-group-lg stagger-item">
                                <label
                                    htmlFor="username"
                                    className="form-label auth-labels text-white"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="form-control auth-textbox"
                                    placeholder="juan123"
                                    id="username"
                                    name="username"
                                    required
                                    value={data.username}
                                    onChange={e => setData('username', e.target.value)}
                                />
                            </div>
                            <div className="mb-4 input-group-lg stagger-item">
                                <label
                                    htmlFor="password"
                                    className="form-label auth-labels text-white"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control auth-textbox"
                                    placeholder="*****"
                                    id="password"
                                    name="password"
                                    required
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-danger w-100 btn-lg stagger-item "
                            >
                                Login
                            </button>
                        </form>
                    </div>

                    <div className="mt-5 text-center">
                        <a href={route("login")} className="text-light auth_btn btn">
                            Login as a Student
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
