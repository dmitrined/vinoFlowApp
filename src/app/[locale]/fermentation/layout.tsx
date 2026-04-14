import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { LoginView } from "@/components/auth/LoginView";
import { SyncEngine } from "@/components/SyncEngine";

export default async function FermentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vinoflow_auth_token")?.value;
  const isAuthed = await verifyAuthToken(token);

  if (!isAuthed) {
    return <LoginView />;
  }

  return (
    <>
      <SyncEngine />
      {children}
    </>
  );
}
