import { useForm } from "react-hook-form"
import { toast } from "sonner";
import "../../../css/modal.css";
import { useRequest } from "@/Library/hooks";

export default function PdfForm({ course, onClose }) {
    const {
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm({
        defaultValues:{
            course_id: course?.course_id,
            course_title: course?.title,
        }
    });
    const { isProcessing, postRequest } = useRequest();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("course_id", data.course_id);
        formData.append("pdf_file", data.pdf_file[0]);
        postRequest("admin.course.pdf.upload", formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.info("Uploading pdf...", { duration: 3000 });
                reset();
                onClose();
            },
            onError: (error)=>{
                toast.error("Error uploading pdf..",{duration: 3000});
                console.log(error);
            }
        });
    };

    return (
        <>
            <div className="modal-body">
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <input
                        type="text"
                        className="form-control d-none"
                        id="courseID"
                        name="course_id"
                        {...register("course_id")}
                        readOnly={true}
                    />
                    <div className="mb-3">
                        <label htmlFor="courseID" className="form-label fs-6">
                            Course Title
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="courseID"
                            name="course_id"
                            value={course.title}
                            readOnly={true}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="materialFile" className="form-label fs-6">Select file to upload</label>
                        <input
                            type="file"
                            className="form-control"
                            id="materialFile"
                            name="pdf_file"
                            accept="application/pdf"
                            {...register("pdf_file", {
                                required: "PDF is required",
                            })}
                            required />
                        {errors.file_name && (
                            <p className="text-danger">{`${errors.pdf_file.message}`}</p>
                        )}
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                    disabled={isSubmitting || isProcessing}
                >
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || isProcessing}
                >
                    Add
                </button>
            </div>
        </>
    )
}