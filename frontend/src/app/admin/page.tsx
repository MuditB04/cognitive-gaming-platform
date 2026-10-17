"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ArrowLeft, Server, Users, Activity, CheckCircle, Database, ShieldAlert } from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-700 hover:text-slate-900 font-bold text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-sm border border-amber-300">
            Development & Authorized Staff Only
          </span>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            System Development Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Internal diagnostics and aggregate activity metrics. No personally identifiable patient health information is exposed.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold text-xl">
            Loading diagnostics...
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 border-2 border-rose-200 rounded-2xl text-rose-800 font-bold text-lg">
            {error} (Ensure backend service is running on http://127.0.0.1:8000)
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-1">
                <span className="text-sm font-bold text-slate-500 uppercase">Users</span>
                <div className="text-3xl font-black text-slate-900">{stats?.user_count ?? 0}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-1">
                <span className="text-sm font-bold text-slate-500 uppercase">Sessions</span>
                <div className="text-3xl font-black text-blue-600">{stats?.session_count ?? 0}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-1">
                <span className="text-sm font-bold text-slate-500 uppercase">Completed</span>
                <div className="text-3xl font-black text-emerald-600">{stats?.completed_sessions ?? 0}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-1">
                <span className="text-sm font-bold text-slate-500 uppercase">Total Attempts</span>
                <div className="text-3xl font-black text-purple-600">{stats?.attempt_count ?? 0}</div>
              </div>
            </div>

            {/* Recent Sessions Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Recent Assessment Sessions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase text-xs">
                      <th className="py-3 px-4">Session ID</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Attempts</th>
                      <th className="py-3 px-4">Started At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {stats?.recent_sessions?.map((s: any) => (
                      <tr key={s.id}>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600">{s.id}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                              s.status === "completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{s.attempts_count}</td>
                        <td className="py-3 px-4 text-slate-500 text-sm">
                          {s.started_at ? new Date(s.started_at).toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
