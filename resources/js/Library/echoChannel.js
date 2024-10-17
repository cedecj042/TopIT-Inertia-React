import { useEffect } from "react";
import { initializeEcho, disconnectEcho } from "@/echo";  // Import your echo initialization functions
import { toast } from "sonner";

export const useAdminChannel = () => {
    useEffect(() => {
        const echoInstance = initializeEcho();  // Initialize Echo
        
        const adminChannel = echoInstance.private('admin')
            .listen('.upload-pdf', (e) => toastMessage(e))
            .listen('.vectorize', (e) => toastMessage(e))
            .listen('.upload-question', (e) => toastMessage(e))
            .listen('.upload', (e) => toastMessage(e));

        return () => {
            adminChannel.stopListening('.upload-pdf');
            adminChannel.stopListening('.vectorize');
            adminChannel.stopListening('upload-question');
            echoInstance.leave('admin');
            disconnectEcho();  // Clean up Echo when component unmounts
        };
    }, []);
};

export const useUserChannel = () => {
    useEffect(() => {
        const echoInstance = initializeEcho();  // Initialize Echo

        const userChannel = echoInstance.private('user')
            .listen('.notification', (e) => toastMessage(e));

        return () => {
            userChannel.stopListening('.notification');
            echoInstance.leave('user');
            disconnectEcho();  // Clean up Echo when component unmounts
        };
    }, []);
};

const toastMessage = (e) => {
    if (e.success) {
        toast.success(`${e.success}`);
    } else if (e.info) {
        toast.info(`${e.info}`);
    } else if (e.error) {
        toast.error(`${e.error}`);
    } else {
        toast.error('An unknown error occurred.');
    }
};
