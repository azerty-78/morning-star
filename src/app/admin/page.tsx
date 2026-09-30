import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/constants/routes";

export default function AdminIndexPage() {
  redirect(ADMIN_ROUTES.dashboard);
}
