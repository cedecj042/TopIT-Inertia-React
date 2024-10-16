import { Toaster } from 'sonner';
import '../../css/app.css';

export default function MainLayout({children}) {
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
