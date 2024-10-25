import React, { useState } from "react";
// import ModuleContent from './ModuleContent';

export default function CollapseContent({ id,children,header }) {

    return (
        <div className="d-inline-flex gap-1 w-100 mb-2">
            <a
                className="text-dark btn btn-outline-light w-100 text-start px-3 py-3"
                data-bs-toggle="collapse"
                href={"#"+id}
                role="button"
                aria-expanded="false"
                aria-controls="collapseExample"
            >
                <h5>{header}</h5>
                <div className="collapse" id={id}>
                    <hr />
                    {children}
                </div>
            </a>
        </div>
    );
}
