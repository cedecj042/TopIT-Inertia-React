import "../../../../css/admin/module.css";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import { useRequest } from "@/Library/hooks";
import ContentTypeForm from "@/Components/Forms/ContentTypeForm";
import { useState } from "react";
import Modal from "@/Components/Modal";
import Changes from "@/Components/Forms/Changes";

function ModuleEdit({ module, queryParams }) {
    const { isProcessing, getRequest } = useRequest();
    const [isOrderChanged, setIsOrderChanged] = useState(false); // Track unsaved order changes
    const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false); // Control warning modal
    const [pendingTab, setPendingTab] = useState(null); // Track the tab to switch to after discarding changes

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

    const [activeContent, setActiveContent] = useState(() => {
        const initialType = "Module";
        return {
            content: module.data,
            type: initialType,
            id: getContentId(module.data, initialType),
        };
    });

    const handleBackClick = async () => {
        getRequest("admin.module.index", queryParams);
    };

    const handleTabClick = (item, type) => {
        if (isOrderChanged) {
            setPendingTab({ item, type });
            setShowUnsavedChangesModal(true); // Show the warning modal
        } else {
            setActiveItem(item, type); // Switch tab if no unsaved changes
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
        setIsOrderChanged(false); // Discard unsaved changes
        setShowUnsavedChangesModal(false);
        if (pendingTab) {
            setActiveItem(pendingTab.item, pendingTab.type); // Switch to the selected tab
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
                    {/* Sidebar Navigation Tabs */}
                    <ul
                        className="nav flex-column content-nav bg-light-subtle rounded m-2"
                        id="v-pills-tab"
                        role="tablist"
                        aria-orientation="vertical"
                    >
                        <li className="list-item mb-2">
                            <a
                                className={`nav-link ${activeContent.type === "Module" ? "active" : ""}`}
                                id="v-pills-module-tab"
                                role="button"
                                onClick={() => handleTabClick(module.data, "Module")}
                            >
                                Module
                            </a>
                        </li>

                        {/* Lessons Tabs */}
                        {module.data.lessons.map((lesson, lessonIndex) => (
                            <li key={`lesson-${lessonIndex}`} className="list-item">
                                <a
                                    className={`nav-link ms-1 ${activeContent.content === lesson ? "active" : ""}`}
                                    role="button"
                                    onClick={() => handleTabClick(lesson, "Lesson")}
                                >
                                    {lesson.title ? lesson.title : <em>No Lesson Title</em>}
                                </a>
                                {/* Sections within each Lesson */}
                                <ul className="nav flex-column ms-3">
                                    {lesson.sections.map((section, sectionIndex) => (
                                        <li key={`section-${sectionIndex}`} className="list-item">
                                            <a
                                                className={`nav-link ms-2 ${activeContent.content === section ? "active" : ""}`}
                                                role="button"
                                                onClick={() => handleTabClick(section, "Section")}
                                            >
                                                {section.title ? section.title : <em>No Section Title</em>}
                                            </a>

                                            {/* Subsections within each Section */}
                                            <ul className="nav flex-column ms-4">
                                                {section.subsections?.map((subsection, subsectionIndex) => (
                                                    <li key={`subsection-${subsectionIndex}`} className="list-item">
                                                        <a
                                                            className={`nav-link ms-3 ${activeContent.content === subsection ? "active" : ""}`}
                                                            role="button"
                                                            onClick={() => handleTabClick(subsection, "Subsection")}
                                                        >
                                                            {subsection.title ? subsection.title : <em>No Subsection Title</em>}
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

                    {/* Content Form Display */}
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

            {/* Unsaved Changes Modal */}
            <Modal 
                show={showUnsavedChangesModal} 
                onClose={() => setShowUnsavedChangesModal(false)}
                modalTitle="Discard Changes"
            >
                <Changes 
                    handleDiscardChanges={handleDiscardChanges} 
                    setShowUnsavedChangesModal={()=>setShowUnsavedChangesModal(false)}
                />
            </Modal>
        </div>
    );
}

export default AdminContent(ModuleEdit);
