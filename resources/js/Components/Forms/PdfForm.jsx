import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form"
import { toast } from "sonner";
import "../../../css/modal.css";
import { useRequest } from "@/Library/hooks";

export default function PdfForm({id,onClose}){
    const {
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm();

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
        });
    };
    
    return(
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="modal-body">
                <div className="mb-3">
                    <label htmlFor="courseID" className="form-label fs-6">
                        Course ID
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="courseID"
                        name="course_id"
                        value={id}
                        {...register("course_id", {
                            required: "Course ID is required",
                        })}
                        readOnly={true}
                    />
                    {errors.course_id && (
                        <p className="text-danger">{`${errors.course_id.message}`}</p>
                    )}
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
                        required/>
                        {errors.file_name && (
                        <p className="text-danger">{`${errors.pdf_file.message}`}</p>
                    )}
                </div>
                
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
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || isProcessing}
                >
                    Add
                </button>
            </div>
        </form>
    )
}