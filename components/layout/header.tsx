import { auth } from "@/auth";

import { Breadcrumb } from "./Breadcrumb";
import { UserMenu } from "./UserMenu";

export async function Header() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4">
      <Breadcrumb />

      <UserMenu
        name={session.user.name ?? ""}
        email={session.user.email ?? ""}
        role={session.user.role}
      />
    </header>
  );
}