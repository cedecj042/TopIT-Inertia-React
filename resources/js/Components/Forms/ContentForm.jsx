import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { ContentTypes } from "@/Library/constants";

export default function ContentForm({ contentData, onClose, handleFormSubmit, isProcessing }) {
    const { register, handleSubmit, setValue, control, watch } = useForm({
        defaultValues: contentData,
    });

    const [previewFile, setPreviewFile] = useState(contentData.file_path || ""); // State for preview
    const type = watch("type"); // Watch the type field to conditionally display fields

    useEffect(() => {
        if (contentData) {
            Object.keys(contentData).forEach((key) => {
                setValue(key, contentData[key]);
            });
        }
    }, [contentData, setValue]);

    useEffect(() => {
        if (type === ContentTypes.TEXT || type === ContentTypes.HEADER) {
            setValue("file_name", "");
            setValue("file_path", "");
            setValue("caption", "");
            setPreviewFile(""); // Clear preview if type changes to text or header
        }
    }, [type, setValue]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewFile(URL.createObjectURL(file)); // Set the preview to the new file
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Conditionally render fields for file-based attachments */}
            {(type === ContentTypes.FIGURE || type === ContentTypes.CODE || type === ContentTypes.TABLE) && (
                <>
                    <div className="mb-3">
                        <label htmlFor="caption" className="form-label text-dark">Caption</label>
                        <input
                            type="text"
                            className="form-control"
                            id="caption"
                            {...register("caption")}
                        />
                    </div>

                    {/* Display preview of existing file or newly selected file */}
                {previewFile && (
                    <div className="mb-2">
                        <label className="form-label text-dark">Current File:</label>
                        <div className="d-flex align-items-center">
                            {/* Show thumbnail if the file is an image */}
                            {contentData.file_path && /\.(jpg|jpeg|png|gif)$/i.test(contentData.file_path) ? (
                                <img
                                    src={previewFile}
                                    alt="preview"
                                    className="img-thumbnail me-2"
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                />
                            ) : (
                                <small className="text-muted">{contentData.file_name || "Uploaded file"}</small>
                            )}
                        </div>
                    </div>
                )}


                    <div className="mb-3">
                        <label htmlFor="file_path" className="form-label text-dark">Upload New File</label>
                        <Controller
                            name="file_path"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    accept="image/*,.pdf,.doc,.docx" // Customize as needed
                                    className="form-control"
                                    id="file_path"
                                    onChange={(e) => {
                                        field.onChange(e.target.files[0]);
                                        handleFileChange(e);
                                    }}
                                />
                            )}
                        />
                    </div>
                </>
            )}

            <div className="row g-3 mb-3">
                <div className="col">
                    <label htmlFor="type" className="form-label text-dark">Type</label>
                    <select className="form-select" id="type" {...register("type")}>
                        {Object.entries(ContentTypes).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label text-dark">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    rows={type === ContentTypes.HEADER ? 1 : 5}
                    {...register("description")}
                ></textarea>
            </div>

            <div className="d-flex gap-2 justify-content-end mb-3">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Close
                </button>
                <button type="submit" className="btn btn-primary" disabled={isProcessing}>
                    Save
                </button>
            </div>
        </form>
    );
}
