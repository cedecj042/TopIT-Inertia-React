import React from 'react';
import { usePage } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout"; 

const Profile = () => {
    const { auth } = usePage().props; 
    const profileImageUrl = auth.user.userable?.profile_image 
        ? `/storage/profile_images/${auth.user.userable.profile_image}` 
        : '/assets/profile-circle.png';

    return (
        <StudentLayout title="Student Profile">
                <div className="row p-3">
                    <div className="row mt-4 px-5">
                        <h3 className="fw-bold">Your Profile</h3>
                    </div>
                </div>
                    <div className="row mt-4 px-5">
                        <div className="d-flex justify-content-between flex-column flex-wrap flex-md-nowrap align-items-start p-5 mb-3">
                            <div className="d-flex flex-row align-items-start p-4 gap-4 w-100">
                                <div className="image-container">
                                    <img 
                                        src={profileImageUrl} 
                                        alt="Profile" 
                                        className="rounded-circle" 
                                        width="150" 
                                        height="150" 
                                    />
                                </div>
                                <div className="py-3 w-100">
                                    <h2>{auth.user.userable?.firstname} {auth.user.userable?.lastname}</h2>
                                    <span>Student</span>
                                    <hr />
                                    <div>
                                        <h5>Personal Details</h5>
                                        <p>Birthdate: {auth.user.userable?.birthdate}</p>
                                        <p>Age: {auth.user.userable?.age}</p>
                                        <p>Gender: {auth.user.userable?.gender}</p>
                                        <p>Address: {auth.user.userable?.address}</p>
                                        <p>School: {auth.user.userable?.school}</p>
                                        <p>Year: {auth.user.userable?.year}</p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    </div>
        </StudentLayout>
    );
};

export default Profile;
