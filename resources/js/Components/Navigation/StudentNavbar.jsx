import { usePage } from "@inertiajs/react";

export default function StudentNavbar(){
    const {auth} = usePage().props;
    console.log('StudentNavbar Rendered', auth);

    const profileImageURL= auth.user && auth.user.userable.profile_image
    ? `/storage/profile_images/${auth.user.userable.profile_image}`
    : '/assets/profile-circle.png';

    return (
        <div className="col-12">
            <nav className="navbar navbar-custom d-flex justify-content-end">
                <div className="d-flex flex-row pe-5 py2 gap-3">
                    <span className="ms-2">
                        Hi, {auth.user && auth.user.username}
                    </span>
                    <div className="bg-dark-subtle rounded-circle">
                    <img
                        src={profileImageURL}
                        alt="Profile Image"
                        className="rounded-circle"
                        width="30"
                        height="30"
                    />
                    </div>
                </div>
            </nav>
        </div>
    )
}