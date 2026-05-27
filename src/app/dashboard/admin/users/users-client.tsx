"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
type Role =
  | "ADMIN"
  | "SALES"
  | "PRODUCTION"
  | "PURCHASING"
  | "QC"
  | "PLANNER"
  | "VIEWER";

const ROLES: Role[] = ["ADMIN", "SALES", "PRODUCTION", "PURCHASING", "QC", "PLANNER", "VIEWER"];

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isActive: boolean;
  employeeId: string | null;
  employee?: { id: string; code: string; name: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

interface EmployeeOption {
  id: string;
  code: string;
  name: string;
}

export default function UsersClient({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const [toDelete, setToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    else showToast("error", "Failed to load users.");
    setLoading(false);
  }, [showToast]);

  const fetchEmployees = useCallback(async () => {
    const res = await fetch("/api/employees");
    if (res.ok) {
      const data = await res.json();
      setEmployees(
        data.map((e: { id: string; code: string; name: string }) => ({
          id: e.id,
          code: e.code,
          name: e.name,
        })),
      );
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
  }, [fetchUsers, fetchEmployees]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/users/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showToast("error", data.error || "Failed to delete user.");
      return;
    }
    showToast("success", `Deleted ${toDelete.email}.`);
    setToDelete(null);
    fetchUsers();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchesQ =
        !q ||
        u.email.toLowerCase().includes(q) ||
        (u.name ?? "").toLowerCase().includes(q) ||
        (u.employee?.name ?? "").toLowerCase().includes(q);
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? u.isActive : !u.isActive);
      return matchesQ && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-xl border px-5 py-4 text-sm shadow-2xl ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-900">User Management</h1>
          <p className="mt-1 text-sm text-blue-500">
            Create system users, assign roles, and link them to employees.
          </p>
        </div>
        <Link
          href="/dashboard/admin/users/create"
          className="rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-cyan-600 hover:to-blue-700"
        >
          + Add User
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-12 gap-4 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
        <input
          type="text"
          placeholder="Search by name, email, employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="col-span-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "ALL" | Role)}
          className="col-span-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm"
        >
          <option value="ALL">All Roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
          className="col-span-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-blue-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-blue-500">No users match the filters.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-50 text-xs font-bold uppercase tracking-wider text-blue-600">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Linked Employee</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50/50">
                  <td className="px-6 py-4 font-semibold text-blue-900">
                    {u.name || <span className="text-blue-300">—</span>}
                    {u.id === currentUserId && (
                      <span className="ml-2 rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                        you
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-blue-700">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-700">
                    {u.employee ? (
                      <span>
                        <span className="font-mono text-xs text-blue-500">{u.employee.code}</span>{" "}
                        {u.employee.name}
                      </span>
                    ) : (
                      <span className="text-blue-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        u.isActive
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                          : "border border-rose-500/30 bg-rose-500/10 text-rose-600"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/admin/users/${u.id}/edit`}
                        className="inline-block rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setToDelete(u)}
                        disabled={u.id === currentUserId}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-blue-950/60 backdrop-blur-md"
            onClick={() => !deleting && setToDelete(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-blue-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-blue-900">Delete user</h3>
            <p className="mt-2 text-sm text-blue-600">
              Permanently delete{" "}
              <span className="font-semibold text-blue-900">{toDelete.email}</span>? This cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 px-5 py-2 text-sm font-semibold text-white hover:from-rose-600 hover:to-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
