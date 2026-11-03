"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  UsersRound,
  Shield,
  UserPlus,
  Trash2,
  Loader2,
  Search,
  Clock,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  roleUpdatedAt?: string;
}

interface AmbassadorApplication {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  collegeName: string;
  degree: string;
  branch: string;
  graduationYear: string;
  studentIdUrl?: string;
  socialProfileUrl?: string;
  campusInfluence: string;
  preferredPromoCode?: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  appliedAt: string;
}

const ROLES = [
  { value: "super_admin", label: "Super Admin" },
  { value: "trip_manager", label: "Trip Manager" },
  { value: "ambassador_coordinator", label: "Ambassador Coordinator" },
  { value: "support", label: "Support" },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-red-500/20 text-red-400 border-red-500/30",
  trip_manager: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ambassador_coordinator: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  support: "bg-green-500/20 text-green-400 border-green-500/30",
};

// ──────────────────────────────────────────────
// Admin Team Tab
// ──────────────────────────────────────────────

function AdminTeamTab() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("trip_manager");
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch {
      toast({ title: "Error", description: "Failed to load team members", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      if (res.ok) {
        toast({ title: "Access Granted", description: `${email} has been assigned the ${role.replace(/_/g, " ")} role.` });
        setEmail("");
        fetchMembers();
      } else {
        const data = await res.json().catch(() => ({}));
        toast({ title: "Error", description: data.error || "Failed to grant access", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (member: Member) => {
    setRemovingId(member.id);
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: member.email, role: "" }),
      });
      if (res.ok) {
        toast({ title: "Access Removed", description: `${member.email} access has been revoked.` });
        fetchMembers();
      } else {
        toast({ title: "Error", description: "Failed to remove access", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Grant Access Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-foreground" />
          Grant Access
        </h3>
        <form onSubmit={handleGrant} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="team@consoulindia.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value} className="bg-black text-white">
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="h-10 px-5 rounded-md bg-foreground text-black text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            Grant Access
          </button>
        </form>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-foreground" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16">
          <UsersRound className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No team members yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 ring-1 ring-white/10">
                          {member.image ? (
                            <AvatarImage src={member.image} alt={member.name} />
                          ) : (
                            <AvatarFallback className="bg-gray-800 text-foreground text-xs">
                              {member.name?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-white font-medium truncate max-w-[180px]">
                          {member.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{member.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${ROLE_COLORS[member.role] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}
                      >
                        {member.role?.replace(/_/g, " ") || "none"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(member.roleUpdatedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemove(member)}
                        disabled={removingId === member.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors disabled:opacity-50"
                      >
                        {removingId === member.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Ambassador Applications Tab
// ──────────────────────────────────────────────

function AmbassadorApplicationsTab() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<AmbassadorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/ambassador-applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch {
      toast({ title: "Error", description: "Failed to load applications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filtered = useMemo(() => {
    let list = applications;
    if (filter !== "all") {
      list = list.filter((a) => a.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.fullName?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q) ||
          a.collegeName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [applications, filter, search]);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/ambassador-applications/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewedBy: "admin" }),
      });
      if (res.ok) {
        toast({ title: "Approved", description: "Ambassador application approved successfully." });
        fetchApplications();
      } else {
        const data = await res.json().catch(() => ({}));
        toast({ title: "Error", description: data.error || "Failed to approve", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/ambassador-applications/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewedBy: "admin", adminNotes: rejectNotes }),
      });
      if (res.ok) {
        toast({ title: "Rejected", description: "Ambassador application rejected." });
        setRejectingId(null);
        setRejectNotes("");
        fetchApplications();
      } else {
        const data = await res.json().catch(() => ({}));
        toast({ title: "Error", description: data.error || "Failed to reject", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-400 border-green-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${map[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
          }`}
      >
        {status}
      </span>
    );
  };

  const filterTabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {filterTabs.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.value
                  ? "bg-foreground/10 text-foreground border border-foreground/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  ({applications.filter((a) => f.value === "all" || a.status === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search name, email, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-xs text-gray-400">Total</span>
          <p className="text-lg font-bold text-white">{applications.length}</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-xs text-yellow-400">Pending</span>
          <p className="text-lg font-bold text-yellow-400">
            {applications.filter((a) => a.status === "pending").length}
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <span className="text-xs text-green-400">Approved</span>
          <p className="text-lg font-bold text-green-400">
            {applications.filter((a) => a.status === "approved").length}
          </p>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {search || filter !== "all"
              ? "No matching applications found"
              : "No ambassador applications yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-white font-semibold text-base">{app.fullName}</h3>
                    {statusBadge(app.status)}
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{app.email}</p>
                  {app.phone && (
                    <p className="text-gray-500 text-xs mt-0.5">{app.phone}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(app.appliedAt)}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">College</span>
                  <p className="text-gray-300 mt-0.5">{app.collegeName || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Degree & Branch</span>
                  <p className="text-gray-300 mt-0.5">
                    {app.degree || "—"} {app.branch ? `— ${app.branch}` : ""}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Graduation Year</span>
                  <p className="text-gray-300 mt-0.5">{app.graduationYear || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Campus Influence</span>
                  <p className="text-gray-300 mt-0.5">{app.campusInfluence || "—"}</p>
                </div>
                {app.preferredPromoCode && (
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Promo Code</span>
                    <p className="text-gray-300 mt-0.5 font-mono">{app.preferredPromoCode}</p>
                  </div>
                )}
                {app.socialProfileUrl && (
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Social Profile</span>
                    <a
                      href={app.socialProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline text-sm flex items-center gap-1 mt-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Profile
                    </a>
                  </div>
                )}
              </div>

              {/* Student ID */}
              {app.studentIdUrl && (
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Student ID</span>
                  <button
                    onClick={() => setPreviewImage(app.studentIdUrl!)}
                    className="mt-1 block rounded-lg overflow-hidden border border-white/10 hover:border-foreground/30 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={app.studentIdUrl}
                      alt="Student ID"
                      className="h-20 w-auto object-cover"
                    />
                  </button>
                </div>
              )}

              {/* Admin Notes (for rejected) */}
              {app.adminNotes && (
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3">
                  <span className="text-red-400 text-xs font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Admin Notes
                  </span>
                  <p className="text-gray-300 text-sm mt-1">{app.adminNotes}</p>
                </div>
              )}

              {/* Reject Notes Input */}
              {rejectingId === app.id && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-3">
                  <label className="text-xs text-gray-400 font-medium">Rejection Notes</label>
                  <Input
                    placeholder="Reason for rejection..."
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={actionId === app.id}
                      className="px-4 py-2 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {actionId === app.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(null);
                        setRejectNotes("");
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Actions (only for pending) */}
              {app.status === "pending" && rejectingId !== app.id && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleApprove(app.id)}
                    disabled={actionId === app.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                  >
                    {actionId === app.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectingId(app.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Student ID Preview"
              className="max-w-full max-h-[80vh] rounded-xl border border-white/10 object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <UsersRound className="w-7 h-7 text-foreground" />
          Team & Access
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage admin team roles and ambassador applications
        </p>
      </div>

      <Tabs defaultValue="team" className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger
            value="team"
            className="data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Team & Access
          </TabsTrigger>
          <TabsTrigger
            value="ambassadors"
            className="data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Ambassador Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          <AdminTeamTab />
        </TabsContent>

        <TabsContent value="ambassadors">
          <AmbassadorApplicationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

