import { useForm} from "react-hook-form";
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { router } from "@inertiajs/react";

export default function FormLogin({routeName,btn}) {
    const {
        register,
        handleSubmit,
        formState:{errors,isSubmitting},
        reset,
        getValues,
    } = useForm();

    const onSubmit = (data) => {
        router.post(route(routeName), data, {
            onSuccess: (page) => {
                alert('Login successful!');
                reset();
            },
            onError: (formErrors) => {
                if (formErrors.username) {
                    alert('Username Error: ' + formErrors.username);
                }
            
                if (formErrors.password) {
                    alert('Password Error: ' + formErrors.password);
                }
                console.error("Submission failed", formErrors);
            }
        });
    };
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
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <div className="mb-3 input-group-lg stagger-item">
                <label htmlFor="username" className="form-label auth-labels"> Username </label>
                <input
                    type="text"
                    className="form-control auth-textbox"
                    placeholder="juan123"
                    id="username"
                    name="username"
                    {...register('username',{
                        required:"Username is required"
                    })}
                />
                <p className="text-danger">{errors.username?.message}</p>
            </div>
            <div className="mb-3 input-group-lg stagger-item">
                <label
                    htmlFor="password"
                    className="form-label auth-labels"
                >
                    Password
                </label>
                <input
                    type="password"
                    className="form-control auth-textbox"
                    placeholder="*****"
                    id="password"
                    name="password"
                    {...register('password',{
                        required:"Password is required"
                    })}
                />
                <p className="text-danger">{errors.password?.message}</p>
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className={`btn w-100 btn-lg stagger-item auth-btn ${btn}`}
            >
                Login
            </button>
        </form>
    );
}
