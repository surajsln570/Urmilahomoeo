"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { patientSchema, type PatientInput } from "@/validations/patient.schema";
import { createPatient, updatePatient, deletePatient } from "@/actions/patient.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Patient } from "@prisma/client";

// Converted from resources/js/Pages/Patient/Index.jsx + PatientModal.jsx + columns.jsx
export function PatientsManager({ initialPatients }: { initialPatients: Patient[] }) {
  const [patients, setPatients] = useState(initialPatients);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientInput>({ resolver: zodResolver(patientSchema) });

  function openCreate() {
    setEditing(null);
    reset({ name: "", age: 0, sex: "male", religion: "hindu", address: "", remark: "", registrationNumber: 0, bloodGroup: "O+", mobile: "", patientName: "" });
    setOpen(true);
  }

  function openEdit(p: Patient) {
    setEditing(p);
    reset({ ...p, remark: p.remark ?? "" } as unknown as PatientInput);
    setOpen(true);
  }

  async function onSubmit(data: PatientInput) {
    const result = editing ? await updatePatient(editing.id, data) : await createPatient(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setOpen(false);
    if (editing) {
      setPatients((prev) => prev.map((p) => (p.id === editing.id ? (result.data as Patient) : p)));
    } else {
      setPatients((prev) => [result.data as Patient, ...prev]);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this patient record?")) return;
    const result = await deletePatient(id);
    if (result.success) {
      toast.success(result.message);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Patient" : "Add Patient"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Guardian / Patient Name</Label>
                  <Input {...register("patientName")} />
                </div>
                <div className="space-y-1">
                  <Label>Age</Label>
                  <Input type="number" {...register("age")} />
                </div>
                <div className="space-y-1">
                  <Label>Mobile</Label>
                  <Input {...register("mobile")} />
                  {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Sex</Label>
                  <select className="w-full h-10 border rounded-md px-3 text-sm" {...register("sex")}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Religion</Label>
                  <select className="w-full h-10 border rounded-md px-3 text-sm" {...register("religion")}>
                    <option value="hindu">Hindu</option>
                    <option value="muslim">Muslim</option>
                    <option value="christian">Christian</option>
                    <option value="sikh">Sikh</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Blood Group</Label>
                  <select className="w-full h-10 border rounded-md px-3 text-sm" {...register("bloodGroup")}>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Registration No.</Label>
                  <Input type="number" {...register("registrationNumber")} />
                  {errors.registrationNumber && <p className="text-xs text-destructive">{errors.registrationNumber.message}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Address</Label>
                <Textarea {...register("address")} />
              </div>
              <div className="space-y-1">
                <Label>Remark</Label>
                <Textarea {...register("remark")} />
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
            <TableHead>Reg. No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Sex</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.registrationNumber}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.age}</TableCell>
              <TableCell className="capitalize">{p.sex}</TableCell>
              <TableCell>{p.mobile}</TableCell>
              <TableCell>{p.bloodGroup}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(p.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {patients.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No patients yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
