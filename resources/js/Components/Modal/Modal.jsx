import { useEffect, useRef } from 'react';
import '../../../css/modal.css';
import gsap from 'gsap';

export default function Modal({ modalTitle, modalSize = null, onClose, show, children }) {
    const contentRef = useRef(null);
    const backdropRef = useRef(null);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";

            if (backdropRef.current) {
                gsap.fromTo(backdropRef.current, 
                    { opacity: 0 }, 
                    { opacity: 1, duration: 0.2, ease: "power2.out" }
                );
            }

            if (contentRef.current) {
                gsap.fromTo(contentRef.current, 
                    { opacity: 0, y: 30 },  
                    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" } 
                );
            }
        } else {
            if (contentRef.current) {
                gsap.to(contentRef.current, {
                    opacity: 0,
                    y: 30, 
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        document.body.style.overflow = "";
                    }
                });
            }

            if (backdropRef.current) {
                gsap.to(backdropRef.current, { 
                    opacity: 0, 
                    duration: 0.5, 
                    ease: "power2.in" 
                });
            }
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [show]);

    if (!show) return null;

    // const handleBackdropClick = (e) => {
    //     if (e.target.classList.contains("modal")) {
    //         onClose();
    //     }
    // };

    return (
        <div
            ref={backdropRef}
            className="modal fade d-block z-50"
            tabIndex="-1"
            aria-labelledby="modalLabel"
            role="dialog"
            aria-hidden="true"
            // onClick={handleBackdropClick}
        >
            <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${modalSize}`}>
                <div className="modal-content" ref={contentRef}>
                    <div className="modal-header">
                        <h5 className="modal-title text-dark" id="modalLabel">
                            {modalTitle}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
