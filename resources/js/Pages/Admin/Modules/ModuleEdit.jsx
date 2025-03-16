import "../../../../css/module.css";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import { useRequest } from "@/Library/hooks";
import ContentTypeForm from "@/Components/Forms/ContentTypeForm";
import { useState, useEffect, useMemo } from "react";
import Modal from "@/Components/Modal/Modal";
import Changes from "@/Components/Forms/Changes";
import { usePage } from "@inertiajs/react";

function ModuleEdit({ module, queryParams = {} }) {
    const { isProcessing, getRequest } = useRequest();
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
    const [pendingTab, setPendingTab] = useState(null);

    const safeQueryParams = useMemo(() => {
        const params = queryParams || {}; // Handle null/undefined queryParams
        return {
            contentableId: params.contentableId || module?.module_id || null, // Provide default, handle missing ID
            contentableType: params.contentableType || "Module" || null, // Provide default, handle missing type
        };
    }, [queryParams, module?.id]);
    
    // Function to get the content ID based on type
    const getContentId = (content, type) => {
        switch (type) {
            case "Module":
                return content.module_id;
            case "Lesson":
                return content.lesson_id;
            case "Section":
                return content.section_id;
            case "Subsection":
                return content.subsection_id;
            default:
                return null;
        }
    };

    // Function to get content based on type and ID
    const getContentByTypeAndId = (type, id) => {
        if (type === "Module") return module.data;
        if (type === "Lesson") return module.data.lessons.find(lesson => lesson.lesson_id === id);
        if (type === "Section") {
            for (const lesson of module.data.lessons) {
                const section = lesson.sections.find(sec => sec.section_id === id);
                if (section) return section;
            }
        }
        if (type === "Subsection") {

            for (const lesson of module.data.lessons) {
                for (const section of lesson.sections) {
                    const subsection = section.subsections.find(sub => sub.subsection_id === id);
                    if (subsection) return subsection;
                }
            }
        }
        return null;
    };

    // Initialize activeContent based on queryParams or default to Module
    const [activeContent, setActiveContent] = useState(() => {
        const initialType = safeQueryParams.contentableType || "Module";
        const initialId = safeQueryParams.contentableId || getContentId(module.data, "Module");
        const initialContent = getContentByTypeAndId(initialType, initialId);
        return {
            content: initialContent || module.data,
            type: initialType,
            id: initialId,
        };
    });

    // Automatically set activeContent based on queryParams when the component mounts or queryParams changes
    useEffect(() => {
        console.log("safeQueryParams:", safeQueryParams);
        if (safeQueryParams.contentableType && safeQueryParams.contentableId) {
            const contentData = getContentByTypeAndId(safeQueryParams.contentableType, safeQueryParams.contentableId);
            if (contentData) {
                setActiveContent({
                    content: contentData,
                    type: safeQueryParams.contentableType,
                    id: safeQueryParams.contentableId,
                });
            }
        }
    }, [module, safeQueryParams]);

    const handleBackClick = async () => {
        getRequest("admin.module.index", {},{
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleTabClick = (item, type) => {
        if (isOrderChanged) {
            setPendingTab({ item, type });
            setShowUnsavedChangesModal(true);
        } else {
            setActiveItem(item, type);
        }
    };

    const setActiveItem = (item, type) => {
        setActiveContent({
            content: item,
            type,
            id: getContentId(item, type),
        });
    };

    const handleDiscardChanges = () => {
        setIsOrderChanged(false);
        setShowUnsavedChangesModal(false);
        if (pendingTab) {
            setActiveItem(pendingTab.item, pendingTab.type);
            setPendingTab(null);
        }
    };
    

    return (
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
                        Edit Module
                    </h5>
                </div>

                <div className="col-12 d-flex align-items-start">
                    <div>
                        <h5 className="fw-semibold mb-3">Navigation</h5>
                        <ul className="nav flex-column content-nav bg-light-subtle rounded m-2" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <li className="list-item mb-2">
                                <a
                                    className={`nav-link ${activeContent.type === "Module" ? "active" : ""}`}
                                    role="button"
                                    onClick={() => handleTabClick(module.data, "Module")}
                                >
                                    Module
                                </a>
                            </li>

                            {module.data.lessons.map((lesson, lessonIndex) => (
                                <li key={`lesson-${lessonIndex}`} className="list-item">
                                    <a
                                        className={`nav-link ms-1 ${activeContent.content === lesson ? "active" : ""}`}
                                        role="button"
                                        onClick={() => handleTabClick(lesson, "Lesson")}
                                    >
                                        {lesson.title || <em>No Lesson Title</em>}
                                    </a>
                                    <ul className="nav flex-column ms-3">
                                        {lesson.sections.map((section, sectionIndex) => (
                                            <li key={`section-${sectionIndex}`} className="list-item">
                                                <a
                                                    className={`nav-link ms-2 ${activeContent.content === section ? "active" : ""}`}
                                                    role="button"
                                                    onClick={() => handleTabClick(section, "Section")}
                                                >
                                                    {section.title || <em>No Section Title</em>}
                                                </a>
                                                <ul className="nav flex-column ms-4">
                                                    {section.subsections?.map((subsection, subsectionIndex) => (
                                                        <li key={`subsection-${subsectionIndex}`} className="list-item">
                                                            <a
                                                                className={`nav-link ms-3 ${activeContent.content === subsection ? "active" : ""}`}
                                                                role="button"
                                                                onClick={() => handleTabClick(subsection, "Subsection")}
                                                            >
                                                                {subsection.title || <em>No Subsection Title</em>}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="tab-content w-100" id="v-pills-tabContent">
                        <ContentTypeForm
                            content={activeContent.content}
                            contentableId={activeContent.id}
                            contentableType={activeContent.type}
                            onOrderChange={setIsOrderChanged}
                        />
                    </div>
                </div>
            </div>

            <Modal show={showUnsavedChangesModal} onClose={() => setShowUnsavedChangesModal(false)} modalTitle="Discard Changes">
                <Changes handleDiscardChanges={handleDiscardChanges} setShowUnsavedChangesModal={() => setShowUnsavedChangesModal(false)} />
            </Modal>
        </div>
    );
}

export default AdminContent(ModuleEdit);
