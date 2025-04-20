import { Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { INITIAL_ASSESSMENT_STATE, INITIAL_TEST_STATE } from "@/Library/filterState";
import { FilterContext } from "@/Components/Context/FilterContext";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import AssessmentList from "@/Components/Test/AssessmentList";
import AssessmentFilters from "@/Components/Filter/AssessmentFilters";
import { useState } from "react";
import Modal from "@/Components/Modal/Modal";

const Assessments = ({ tests = [],queryParams={},filters}) => {
    const testsData = tests.data || [];

    const [openModal,setOpenModal] = useState(false);
    return (
        <>
            <main className="row p-3">
                <div className="row mt-3 px-5">
                    <div className="col mb-3 btn-toolbar justify-content-between">
                        <h2 className="fw-bolder m-0">Assessments</h2>
                        <button
                            type="button"
                            className="btn btn-primary btn-md btn-size btn-toolbar gap-2"
                            // onClick={openModal}
                        >
                            <span className="material-symbols-outlined">tune</span>
                            <span className="fs-6">Adjust Types</span>
                        </button>
                    </div>
                </div>
                
                <div className="row mt-3 px-5">

                <FilterContext
                    initialState={INITIAL_ASSESSMENT_STATE(queryParams)}
                    routeName={'admin.assessments.index'}
                    components={tests}
                >
                    <AssessmentFilters filters={filters} />
                    <AssessmentList tests={testsData} />
                </FilterContext>
                </div>
                
                <div className="row mt-2">
                    <div className="col-12">
                        <Pagination links={tests.meta.links} queryParams={queryParams}  />
                    </div>
                </div>
            </main>
            <Modal
                show={openModal}
                onClose={() => setOpenModal(false)}
                modalSize={"lg"}
                modalTitle={"Adjust Assessment Types"}
            >
                
            </Modal>
        </>
    );
};
export default AdminContent(Assessments);
