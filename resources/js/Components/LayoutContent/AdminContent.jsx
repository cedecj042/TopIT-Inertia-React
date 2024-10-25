import AdminLayout from "@/Layouts/AdminLayout";
import AdminListener from "@/Components/LayoutContent/AdminListener";
import MainLayout from "@/Layouts/MainLayout";

export const AdminContent = (Component) => {
    const LayoutWrapper = (page) => {
        const {
            props: { title },
        } = page;

        return (
            <MainLayout>
                <AdminListener>
                    <AdminLayout title={title}>{page}</AdminLayout>
                </AdminListener>
            </MainLayout>
        );
    };

    Component.layout = LayoutWrapper;
    return Component;
};
