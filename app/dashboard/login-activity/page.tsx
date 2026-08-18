"use client";

import { useState, useEffect, useMemo } from "react";
import { Activity, Search, Clock, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface LoginEntry {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  provider: string;
  loginAt: string;
}

export default function LoginActivityPage() {
  const [activities, setActivities] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch("/api/login-activity?limit=200");
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to fetch login activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return activities;
    const q = search.toLowerCase();
    return activities.filter(
      (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q)
    );
  }, [activities, search]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getProviderBadge = (provider: string) => {
    if (provider === "google") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
          Google
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
        {provider || "credentials"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Activity className="w-7 h-7 text-gold" />
          Login Activity
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Track who has logged into the website
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-xs text-gray-400">Total Logins</span>
          <p className="text-lg font-bold text-white">{activities.length}</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-xs text-gray-400">Unique Users</span>
          <p className="text-lg font-bold text-white">
            {new Set(activities.map((a) => a.email)).size}
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {search ? "No matching login records found" : "No login activity yet"}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Login Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 ring-1 ring-white/10">
                          {entry.image ? (
                            <AvatarImage src={entry.image} alt={entry.name} />
                          ) : (
                            <AvatarFallback className="bg-gray-800 text-gold text-xs">
                              {entry.name?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-white font-medium truncate max-w-[180px]">
                          {entry.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {entry.email}
                    </td>
                    <td className="px-4 py-3">
                      {getProviderBadge(entry.provider)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(entry.loginAt)}
                      </div>
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
