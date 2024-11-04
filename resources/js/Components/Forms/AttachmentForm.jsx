import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { AttachmentTypes } from "@/Library/constants";

export default function AttachmentForm({ attachmentData, onClose, handleFormSubmit }) {
    const { register, handleSubmit, setValue, control, watch } = useForm({
        defaultValues: attachmentData,
    });

    const type = watch("type"); // Watch the type field to conditionally display fields

    useEffect(() => {
        if (attachmentData) {
            Object.keys(attachmentData).forEach((key) => {
                setValue(key, attachmentData[key]);
            });
        }
    }, [attachmentData, setValue]);

    useEffect(() => {
        if (type === AttachmentTypes.TEXT || type === AttachmentTypes.HEADER) {
            setValue("file_name", "");
            setValue("file_path", "");
            setValue("caption", "");
        }
    }, [type, setValue]);


    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            {type !== AttachmentTypes.TEXT && type !== AttachmentTypes.HEADER && (
                <>
                    <div className="mb-3">
                        <label htmlFor="caption" className="form-label">Caption</label>
                        <input
                            type="text"
                            className="form-control"
                            id="caption"
                            {...register("caption")}
                            readOnly={type === AttachmentTypes.TEXT || type === AttachmentTypes.HEADER}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="file_path" className="form-label">Upload Image</label>
                        <Controller
                            name="file_path"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    accept="image/*" // Only allow image files
                                    className="form-control"
                                    id="file_path"
                                    onChange={(e) => field.onChange(e.target.files[0])}
                                />
                            )}
                        />
                    </div>
                </>
            )}

            <div className="row g-3 mb-3">
                <div className="col">
                    <label htmlFor="type" className="form-label">Type</label>
                    <select className="form-select" id="type" {...register("type")}>
                        {Object.entries(AttachmentTypes).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    rows={type === AttachmentTypes.HEADER ? 1 : 5}
                    {...register("description")}
                ></textarea>
            </div>

            <div className="d-flex gap-2 justify-content-end mb-3">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Close
                </button>
                <button type="submit" className="btn btn-primary">
                    Save
                </button>
            </div>
        </form>
    );
}
