import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/constants/routes";

export default function Home() {
  redirect("/admin-login");
}
