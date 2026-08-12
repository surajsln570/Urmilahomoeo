import { getAllUsers } from "@/actions/user.actions";
import { UsersManager } from "@/components/dashboard/users-manager";

// Converted from UserController::getUser()
export default async function UsersPage() {
  const users = await getAllUsers();
  return <UsersManager initialUsers={users} />;
}
