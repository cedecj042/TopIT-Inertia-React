// import SectionContent from "./SectionContent";

// export default function LessonContent({ data }) {
//     console.log(data)
//     return (
//         <>
//             {data.map((lesson, index) => {
//                 return (
//                     <div className="col-12 mb-3" key={index}>
//                         <h5>{lesson.title}</h5>
//                             {/* <SectionContent data={lesson.sections}/> */}
//                     </div>
//                 );
//             })}
//         </>
//     );
// }

import { dissectContent } from '@/Library/utils';
import SectionContent from './SectionContent';
import ContentItem from './ContentItem';

export default function LessonContent({ data }) {
    return (
        <>
            {data.map((lesson, index) => {
                // Process lesson content using dissectContent
                const lessonContent = dissectContent(lesson.content);

                return (
                    
                    <div className="lesson p-3" key={index}>
                        <h4 className="lesson-title mb-3 fw-semibold">{lesson.title}</h4>

                        {/* Display the dissected lesson content */}
                        {lessonContent.map((item, idx) => (
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

