import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export default function HeaderLogin() {

    const titleRef =useRef(null);
    const subtitleRef =useRef(null);

    useEffect(() => {
        gsap.from(titleRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power2.out'
        });
        gsap.from(subtitleRef.current, {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power2.out',
            delay: 0.5
        });
    }, []);
    return (
        <div className="col-7 d-flex align-items-center">
            <div className="ps-5 ms-5">
                <img
                    src="/assets/logo-2.svg"
                    alt="TopIT Logo"
                    width="100"
                    height="30"
                    className="position-absolute top-0 start-0 mt-4 ms-4"
                />
                <div className="text-start">
                    <h4
                        className="fw-semibold mb-3"
                        style={{ color: "#0757C6" }}
                        ref={subtitleRef}
                    >
                        Master Your IT Competency
                    </h4>
                    <h1 className="fw-bold" ref={titleRef}>
                        Your Path to Excellence <br /> Starts Here!
                    </h1>
                </div>
            </div>
        </div>
    );
}
