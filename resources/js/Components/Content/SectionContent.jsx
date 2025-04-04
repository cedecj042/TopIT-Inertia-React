import { dissectContent } from "@/Library/utils";
import SubsectionContent from "./SubsectionContent";
import ContentItem from "./ContentItem";
import CollapseContent from "./CollapseContent";

export default function SectionContent({ sections }) {
    return (
        <>
            {sections.map((section, index) => {
                return (
                        <div className="section p-4 bg-light mb-4 rounded" key={index} id={`section-${index}`}>
                            <h5 className="section-title fw-semibold">{section.title}</h5>

                            {section.contents.map((item, idx) => {
                                return <ContentItem key={idx} item={item} />;
                            })}

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
