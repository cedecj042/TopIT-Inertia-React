import React from 'react';

const Navbar = ({ isLight = false }) => (
    <nav className={`navbar navbar-expand-lg ${isLight ? 'navbar-light bg-white shadow-sm' : ''}`} style={{ height: "60px" }}>
        <div className="container-fluid">
            <a href="#">
                <img
                    src="/assets/logo-3.svg"
                    alt="Logo"
                    style={{ width: "150px", height: "30px", marginLeft: "0px" }}
                />
            </a>
        </div>
    </nav>
);

export default Navbar;