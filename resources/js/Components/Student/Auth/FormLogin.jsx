import {Link, useForm } from "@inertiajs/react";


export default function FormLogin() {

    const { data, setData, post, errors, reset } = useForm({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value); // Updates the form data in the state
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.login'), {
            onSuccess: () => reset('password'), // Optionally reset the password field after success
        });
    };

    return (
        <div className="col d-flex align-items-center form-bg">
            <div className="w-100 px-5 mx-4">
                <form onSubmit={handleSubmit} className="mt-5">
                    <h3 className="fw-bold">Login</h3>
                    <div className="mb-3">
                        <label
                            htmlFor="username"
                            className="form-label auth-labels text-dark"
                        >
                            Username
                        </label>

                         <input
                            type="text"
                            className="form-control auth-textbox"
                            placeholder="juan123"
                            id="username"
                            name="username"
                            value={data.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && (
                            <span className="text-danger">
                                {errors.username}
                            </span>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="form-label auth-labels text-dark"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control auth-textbox"
                            placeholder="*****"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && (
                            <span className="text-danger">
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 auth-button"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-3">
                    <Link href="#" className="text-dark auth_btn">
                        Forgot Password?
                    </Link>
                </div>
                <div className="mt-5 text-center">
                    <Link href="/register" className="text-dark auth_btn">
                        Register Now
                    </Link>
                </div>
                <br />
                <div className="mt-5 text-center">
                    <Link href="/admin/login" className="text-dark auth_btn">
                        Admin Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
