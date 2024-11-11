import { type UserRole } from "@prisma/client";

interface PermissionProps extends React.PropsWithChildren {
  role: UserRole;
  allowedRoles: UserRole[];
}

const Permission: React.FC<PermissionProps> = ({
  role,
  allowedRoles,
  children,
}) => <>{allowedRoles.includes(role) && children}</>;

export default Permission;
