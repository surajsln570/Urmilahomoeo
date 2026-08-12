"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { userSchema, updateUserSchema, type UserInput, type UpdateUserInput } from "@/validations/user.schema";
import { createUser, updateUser, deleteUser } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { User, Role } from "@prisma/client";

type UserWithRole = User & { role: Role };

// Converted from resources/js/Pages/users/Index.jsx + usercard.blade.php + UserController
export function UsersManager({ initialUsers }: { initialUsers: UserWithRole[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserWithRole | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserInput | UpdateUserInput>({
    resolver: zodResolver(editing ? updateUserSchema : userSchema),
  });

  function openCreate() {
    setEditing(null);
    reset({ name: "", mobile: "", email: "", password: "" });
    setOpen(true);
  }
  function openEdit(u: UserWithRole) {
    setEditing(u);
    reset({ name: u.name, mobile: u.mobile, email: u.email, password: "" });
    setOpen(true);
  }

  async function onSubmit(data: UserInput | UpdateUserInput) {
    const result = editing ? await updateUser(editing.id, data) : await createUser(data as UserInput);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setOpen(false);
    if (editing) {
      setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...(result.data as User) } : u)));
    } else {
      setUsers((prev) => [{ ...(result.data as User), role: { id: 0, name: "Patient" } as Role }, ...prev]);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this user?")) return;
    const result = await deleteUser(id);
    if (result.success) {
      toast.success(result.message);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Mobile</Label>
                <Input {...register("mobile")} />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" {...register("email")} disabled={!!editing} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Password {editing && "(leave blank to keep current)"}</Label>
                <Input type="password" {...register("password")} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2" />}
                {editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.mobile}</TableCell>
              <TableCell>
                <Badge variant="outline">{u.role?.name ?? "—"}</Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="icon" variant="ghost" onClick={() => openEdit(u)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(u.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No users yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
