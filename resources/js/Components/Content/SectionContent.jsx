import { dissectContent } from "@/Library/utils";
import SubsectionContent from "./SubsectionContent";
import ContentItem from "./ContentItem";
import CollapseContent from "./CollapseContent";

export default function SectionContent({ sections }) {
    console.log(sections);
    return (
        <>
            {sections.map((section, index) => {
                // Process section content (text) using dissectContent
                const sectionContent = dissectContent(section.content);

                // Map through tables, figures, and codes, adding their `order` and type
                const tables = section.tables.map((table) => ({
                    type: "table",
                    order: table.order,
                    content: table,
                }));

                const figures = section.figures.map((figure) => ({
                    type: "figure",
                    order: figure.order,
                    content: figure,
                }));

                const codes = section.codes.map((code) => ({
                    type: "code",
                    order: code.order,
                    content: code,
                }));

                // Merge all content (text, tables, figures, codes) and sort by order
                const mergedContent = [
                    ...sectionContent,
                    ...tables,
                    ...figures,
                    ...codes,
                ].sort((a, b) => a.order - b.order);

                return (
                        <div className="section p-4 bg-light mb-4 rounded" key={index}>
                            <h5 className="section-title fw-semibold">{section.title}</h5>

                            {/* Render merged and sorted content */}
                            {mergedContent.map((item, idx) => {
                                // console.log(item);
                                return <ContentItem key={idx} item={item} />;
                            })}

                            {/* Render subsections if available */}
                            {section.subsections &&
                                section.subsections.length > 0 && (
                                    <SubsectionContent
                                        subsections={section.subsections}
                                    />
                                )}
                        </div>
                );
            })}
        </>
    );
}
