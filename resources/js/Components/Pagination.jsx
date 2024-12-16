import { Link } from "@inertiajs/react";

export default function Pagination({ links, queryParams = {} }) {
    return (
        <nav aria-label="Page navigation example" className="text-center mt-4 d-flex gap-2 justify-content-center">
            <ul className="pagination">
                {links.map((link, index) => (
                    <li
                        key={index}
                        className={
                            `page-item ${link.active ? "active" : ""}` +
                            `${link.url === null ? " disabled" : ""} `
                        }
                    >
                        <Link
                            preserveState={true} 
                            preserveScroll={true}
                            href={
                                link.url
                                    ? `${link.url.split('?')[0]}?${new URLSearchParams({
                                          ...queryParams,
                                          page: new URL(link.url).searchParams.get('page') || 1, // Add or replace the page parameter
                                      }).toString()}`
                                    : ""
                            }
                            className="page-link"
                            dangerouslySetInnerHTML={{
                                __html: link.label.includes("Previous")
                                    ? "&lsaquo;"
                                    : link.label.includes("Next")
                                    ? "&rsaquo;"
                                    : link.label,
                            }}
                        ></Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}