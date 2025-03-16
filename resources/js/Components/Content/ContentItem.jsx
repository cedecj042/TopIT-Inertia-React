import { replaceSemicolonsWithCommas } from "@/Library/utils";
import React from "react";

export default function ContentItem({ item }) {
    switch (item.type.toLowerCase()) {
        case "text":
            return (
                <p className="m-0 text-content">
                    {replaceSemicolonsWithCommas(item.description)}
                </p>
            );

        case "tables":
            return (
                <div className="table my-3 w-100">
                    {item.file_path ? (
                        <div className="table-images d-flex flex-column justify-content-center gap-2">
                            <img
                                src={item.file_path}
                                alt="Table Image"
                                className="img-fluid"
                            />
                            <p className="table-title text-center mt-2">
                                {item.caption}
                            </p>
                        </div>
                    ) : (
                        <p>No images available for this table.</p>
                    )}
                </div>
            );

        case "figures":
            return (
                <div className="figure my-3 w-100">
                    <div className="figure-images d-flex flex-column justify-content-center gap-2">
                        <img
                            src={item.file_path}
                            alt="Figure Image"
                            className="img-fluid"
                        />
                        <p className="figure-title text-center mt-2">
                            {item.caption}
                        </p>
                    </div>
                </div>
            );

        case "code":
            return (
                <div className="code my-3 w-100">
                    <div className="code-images d-flex flex-column justify-content-center">
                        <img
                            src={item.file_path}
                            alt="Code Image"
                            className="img-fluid"
                        />
                        <p className="code-title text-center mt-2">
                            {item.caption}
                        </p>
                    </div>
                </div>
            );

        default:
            return null;
    }
}
