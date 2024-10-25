import ModuleContent from "@/Components/Content/ModuleContent";
import "../../../css/admin/module.css";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import { useRequest } from "@/Library/hooks";
import { dissectContent } from "@/Library/utils";
import CollapseContent from "@/Components/Content/CollapseContent";
import LessonContent from "@/Components/Content/LessonContent";

function ModuleDetail({ module, queryParams }) {
    const { isProcessing, getRequest } = useRequest();
    const handleBackClick = async () => {
        getRequest("admin.module.index", queryParams);
    };
    return (
        <>
            <div className="container-fluid p-5">
                <div className="row">
                    <div className="col-12 btn-toolbar mb-3">
                        <button
                            className="btn btn-transparent"
                            disabled={isProcessing}
                            onClick={handleBackClick}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <h5 className="fw-regular mb-0 align-content-center">
                            Module Detail
                        </h5>
                    </div>
                    <div className="col-12 px-5 pt-3">
                        <div className="row mb-2">
                            <h2 className="fw-bolder mb-3">
                                {module.data.title}
                            </h2>
                            <div id="header">
                                {module.data.content ? (
                                    <ModuleContent
                                        content={dissectContent(
                                            module.data.content
                                        )}
                                    />
                                ) : (
                                    <p>No content available for this module.</p>
                                )}
                            </div>
                        </div>
                        <hr />

                        {module.data.lessons && (
                            <div className="row">
                                <LessonContent data={module.data.lessons} />
                            </div>
                        )}
                    </div>
                    {/* <div className="col-2 h-50 position-sticky">
                        <h6>{module.data.title}</h6>
                        <ul>
                        {module.data.lessons.map((lesson)=>(
                            <li><a href="">{lesson.title}</a>
                                <ul>
                                    {lesson.sections.map((section)=>(
                                        <li><a href="">{section.title}</a></li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                        </ul>
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default AdminContent(ModuleDetail);
