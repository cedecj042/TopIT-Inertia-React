import { dissectContent } from "@/Library/utils";
import ContentItem from "./ContentItem";

export default function SubsectionContent({ subsections }) {
    return (
        <>
            {subsections.map((subsection, index) => {
                // Process subsection content (text) using dissectContent
                const subsectionContent = dissectContent(subsection.content);

                // Map through tables, figures, and codes, adding their `order` and type
                const tables = subsection.tables.map((table) => ({
                    type: "table",
                    order: table.order,
                    content: table,
                }));

                const figures = subsection.figures.map((figure) => ({
                    type: "figure",
                    order: figure.order,
                    content: figure,
                }));

                const codes = subsection.codes.map((code) => ({
                    type: "code",
                    order: code.order,
                    content: code,
                }));

                // Merge all content (text, tables, figures, codes) and sort by order
                const mergedContent = [
                    ...subsectionContent,
                    ...tables,
                    ...figures,
                    ...codes,
                ].sort((a, b) => a.order - b.order);

                return (
                    <div className="subsection p-3" key={index}>
                        <div className="subsection-title d-flex gap-1 flex-row align-items-center mb-1">
                            <span className="badge bg-secondary rounded-pill ml-2">
                                {index}
                            </span>
                            <h6 className="m-0 fw-semibold">{subsection.title}</h6>
                        </div>

                        {/* Render merged and sorted content */}
                        {mergedContent.map((item, idx) => (
                            <ContentItem key={idx} item={item} />
                        ))}
                    </div>
                );
            })}
        </>
    );
}
