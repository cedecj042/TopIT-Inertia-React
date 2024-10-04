export default function MainLayout({children}) {
    return (
        <div>
            <div className="background"></div>
            <div className="container-fluid">
                <div className="row vh-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
