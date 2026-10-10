import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Wajib dipanggil di setiap page, server action, dan route handler.
 * Mengembalikan userId dari sesi server, tidak pernah dari input klien.
 */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/login");
  return id;
}
