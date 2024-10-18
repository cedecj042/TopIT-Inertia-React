import MainLayout from "@/Layouts/MainLayout";
import StudentLayout from "@/Layouts/StudentLayout";

export const StudentContent = (Component) => {
    const LayoutWrapper = (page) => {
        const {
            props: { title },
        } = page;

        return (
            <MainLayout>
                <StudentLayout title={title}>{page}</StudentLayout>
            </MainLayout>
        );
    };

    Component.layout = LayoutWrapper;
    return Component;
};
