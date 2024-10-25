import { useAdminChannel } from "@/Library/echoChannel";

export default function AdminListener({ children }) {
    useAdminChannel();
    return children ;
}
