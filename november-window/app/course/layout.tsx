import { redirect } from "next/navigation";
import { getAccess } from "@/lib/access";

export default async function CourseLayout({ children }: { children: React.ReactNode }) {
  const access = await getAccess();
  if (!access.userId) redirect("/login");
  if (!access.hasCourseAccess) redirect("/#pricing");
  return <>{children}</>;
}
