import SectionContent from "./SectionContent";
import ContentItem from "./ContentItem";

export default function LessonContent({ data }) {

    return (
        <>
            {data.map((lesson, index) => {
                return (
                    <div className="lesson p-3" key={index} id={`lesson-${index}`}>
                        <h4 className="lesson-title mb-3 fw-semibold">
                            {lesson.title}
                        </h4>

                        {/* Render merged and sorted content */}
                        {lesson.contents.map((item, idx) => (
                            <ContentItem key={idx} item={item} />
                        ))}

                        {/* If there are sections, render SectionContent */}
                        {lesson.sections && lesson.sections.length > 0 && (
                            <SectionContent sections={lesson.sections} />
                        )}
                    </div>
                );
            })}
        </>
    );
}
