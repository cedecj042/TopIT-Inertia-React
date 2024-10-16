// import { useEffect } from "react";
// import echo from "@/echo";
// import { toast } from "sonner";

// export const useAdminChannel = () => {
//     useEffect(() => {
//         const adminChannel = echo.private('admin')
//             .listen('.upload-pdf', (e) => toastMessage(e))
//             .listen('.vectorize', (e) => toastMessage(e))
//             .listen('upload-question', (e) => toastMessage(e));

//         return () => {
//             adminChannel.stopListening('.upload-pdf');
//             adminChannel.stopListening('.vectorize');
//             adminChannel.stopListening('upload-question');
//             echo.leave('admin');
//         };
//     }, []);
// };

// export const useUserChannel = () => {
//     useEffect(() => {
//         const userChannel = echo.private('user')
//             .listen('.notification', (e) => toastMessage(e));

//         return () => {
//             userChannel.stopListening('.notification');
//             echo.leave('user');
//         };
//     }, []);
// };


// const toastMessage = (e) => {
//     console.log('Event Received:', e);
//     if (e.success) {
//         toast.success(`Success: ${e.success}`);
//     } else if (e.info) {
//         toast.info(`Info: ${e.info}`);
//     } else if (e.error) {
//         toast.error(`Error: ${e.error}`);
//     } else {
//         toast.error('An unknown error occurred.');
//     }
// };