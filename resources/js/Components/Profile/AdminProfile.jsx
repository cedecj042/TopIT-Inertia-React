import '../../../css/profile.css';

export default function AdminProfile({ auth, openEditModal, close }) {
    const admin = auth.userable.data;

    const profileImageURL = admin.profile_image
        ? `/storage/profile_images/${admin.profile_image}`
        : '/assets/profile-circle.png';

    return (
        <>
            <div className="modal-body p-3">
                <div className="d-inline-flex gap-2 justify-content-center w-100 px-3s">
                    <div className="image-container">
                        <img
                            src={profileImageURL}
                            alt="Profile"
                            className="rounded-circle"
                            width="150"
                            height="150"
                        />
                    </div>
                    <div className="py-3 flex-grow-1">
                        <h2>
                            {admin.firstname}{" "}
                            {admin.lastname}
                        </h2>
                        <hr />
                        <div className='col-12'>
                            <h5 className="mb-3">Details</h5>
                            <div className="details-container">
                                <div className="detail-row">
                                    <span className="detail-key">Username:</span>
                                    <span className="detail-value">{auth.user.username}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-key">Email:</span>
                                    <span className="detail-value">{auth.user.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-key">Created At:</span>
                                    <span className="detail-value">{admin.created_at}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-key">Last Login:</span>
                                    <span className="detail-value">{admin.last_login}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <button className='btn btn-secondary' onClick={close}>Cancel</button>
                <button className='btn btn-primary' onClick={openEditModal}>Edit</button>
            </div>
        </>
    );
}
