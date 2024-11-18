import { auth } from "@clerk/nextjs/server";
import NoPermissionCard from "./NoPermissionCard";

export default async function HasPermission({
  permission,
  children,
  renderFallback,
  fallbackText,
}: {
  permission: (userId: string | null) => Promise<boolean>;
  children: React.AwaitedReactNode;
  renderFallback?: boolean;
  fallbackText?: string;
}) {
  const { userId } = await auth();
  const hasPermission = await permission(userId);

  if (hasPermission) return children;

  if (renderFallback)
    return <NoPermissionCard>{fallbackText}</NoPermissionCard>;

  return null;
}
