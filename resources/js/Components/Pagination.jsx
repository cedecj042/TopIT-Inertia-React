import { Link } from "@inertiajs/react";
import '../../css/admin/navigation.css';

export default function Pagination({links}){
    return (
        <nav className="text-center mt-4 d-flex gap-2 justify-content-center">
            {links.map((link, index) => (
                <Link
                    preserveScroll={true}
                    key={index}
                    href={link.url || ""}
                    className={`btn ${link.active ? 'btn-primary' : 'btn-light'}` + `${link.url === null ? " disabled" : ""}` }                    
                    dangerouslySetInnerHTML={{ __html: link.label.includes('Previous') ? '&lsaquo;' : link.label.includes('Next') ? '&rsaquo;' : link.label }}
                >
                </Link>
            ))}
        </nav>
    )
}