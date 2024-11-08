import { dissectContent } from "@/Library/utils";
import ContentItem from "./ContentItem";

export default function SubsectionContent({ subsections }) {
    return (
        <>
            {subsections.map((subsection, index) => {
                return (
                    <div className="subsection p-3" key={index}>
                        <div className="subsection-title d-flex gap-1 flex-row align-items-center mb-1">
                            <span className="badge bg-secondary rounded-pill ml-2">
                                {index}
                            </span>
                            <h6 className="m-0 fw-semibold">{subsection.title}</h6>
                        </div>

                        {/* Render merged and sorted content */}
                        {subsection.contents.map((item, idx) => (
                            <ContentItem key={idx} item={item} />
                        ))}
                    </div>
                );
            })}
        </>
    );
}
