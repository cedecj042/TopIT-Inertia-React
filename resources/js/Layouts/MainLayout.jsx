import { Toaster } from 'sonner';
import '../../css/app.css';
import echo from "@/echo";
import { toast } from "sonner";
import { useEffect } from "react";

export default function MainLayout({children}) {
    useEffect(() => {
        // Subscribe to the channel 'upload' and listen for the 'sample' event
        echo.channel('upload') // Pass channel name as a string
            .listen('sample', (e) => {
                console.log(e);  // Log the event data to the console
                toast.success(`Message: ${e.message}`);  // Display the message from the event
            });

        return () => {
            // Leave the channel when the component unmounts
            echo.leave('upload');
        };
    }, []);
    return (
        <div>
            <div className="background"></div>
            <Toaster position="bottom-right" richColors toastOptions={{
                    style: {
                        right:'1rem',
                        fontSize:'1rem'
                    }
                }} />
            <div className="container-fluid">
                <div className="row vh-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
