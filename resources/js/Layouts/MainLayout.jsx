import { Toaster } from "sonner";
import "../../css/app.css";

export default function MainLayout({ children }) {
    return (
        <>
            <div className="background"></div>
            <Toaster
                position="top-right"
                richColors
                toastOptions={{
                    style: {
                        right: "1rem",
                        fontSize: "1rem",
                    },
                }}
                closeButton 
            />
            {children}
        </>
    );
}
