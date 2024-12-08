import '../../../css/profile.css';

export default function AdminProfile({auth,openEditModal, close }) {
    const admin = auth.userable;
    console.log(admin);

    const profileImageURL = admin.profile_image
        ? `/storage/profile_images/${admin.profile_image}`
        : '/assets/profile-circle.png';

    return (
        <>
            <div className="modal-body">
                <div className="d-inline-flex gap-5">
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
                        <div>
                            <h5 className="mb-3">Details</h5>
                            <p>Username: {auth.user.username}</p>
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
