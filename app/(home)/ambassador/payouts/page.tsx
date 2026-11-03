"use client";

import { useState } from "react";
import {
  Wallet,
  IndianRupee,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type TransactionStatus = "Processed" | "Pending" | "Failed";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  upiVpa: string;
  utrReference: string;
  status: TransactionStatus;
}

// TODO: Replace with actual API call to /api/ambassador/payouts
const placeholderTransactions: Transaction[] = [
  {
    id: "txn-001",
    date: "2026-10-30",
    amount: 1500,
    upiVpa: "rahul@okaxis",
    utrReference: "UTR928374650123",
    status: "Processed",
  },
  {
    id: "txn-002",
    date: "2026-10-25",
    amount: 2000,
    upiVpa: "rahul@okaxis",
    utrReference: "UTR928374650456",
    status: "Processed",
  },
  {
    id: "txn-003",
    date: "2026-11-01",
    amount: 750,
    upiVpa: "rahul@okaxis",
    utrReference: "—",
    status: "Pending",
  },
  {
    id: "txn-004",
    date: "2026-10-20",
    amount: 500,
    upiVpa: "rahul@paytm",
    utrReference: "UTR928374650789",
    status: "Failed",
  },
];

// TODO: Fetch from API: GET /api/ambassador/payouts/summary
const placeholderSummary = {
  availableBalance: 2250,
  pendingClearance: 750,
  totalWithdrawn: 3500,
};

const statusConfig: Record<
  TransactionStatus,
  { color: string; bg: string; icon: React.ElementType }
> = {
  Processed: { color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle },
  Pending: { color: "text-amber-400", bg: "bg-amber-500/10", icon: Clock },
  Failed: { color: "text-red-400", bg: "bg-red-500/10", icon: XCircle },
};

export default function PayoutsPage() {
  const [upiVpa, setUpiVpa] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const summary = placeholderSummary;
  const transactions = placeholderTransactions;

  const handleRequestPayout = async () => {
    if (!upiVpa.trim()) {
      toast({ title: "Error", description: "Please enter your UPI VPA" });
      return;
    }

    // Basic UPI VPA validation (user@provider)
    if (!/^[\w.-]+@[\w]+$/.test(upiVpa.trim())) {
      toast({
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI VPA (e.g. name@upi, name@okaxis)",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount" });
      return;
    }

    if (numAmount > summary.availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You can withdraw up to ₹${summary.availableBalance.toLocaleString()}`,
      });
      return;
    }

    setSubmitting(true);

    // TODO: POST /api/ambassador/payouts/request { upiVpa, amount }
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Payout Requested! 🎉",
      description: `₹${numAmount.toLocaleString()} will be sent to ${upiVpa} within 3-5 business days.`,
    });

    setUpiVpa("");
    setAmount("");
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Payouts</h2>
        <p className="text-gray-400 mt-1">
          Request payouts and track your earnings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white/5 border border-white/10 rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ₹{summary.availableBalance.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Available Balance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border border-white/10 rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ₹{summary.pendingClearance.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Pending Clearance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border border-white/10 rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-gold/10 rounded-xl">
              <ArrowUpRight className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ₹{summary.totalWithdrawn.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Total Withdrawn</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Request Form */}
      <Card className="bg-white/5 border border-white/10 rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-gold" />
            Request Payout
          </h3>
          <p className="text-xs text-gray-500 mb-5">
            Enter your UPI VPA (GPay / PhonePe / Paytm) and the amount to withdraw
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1.5 block">
                UPI VPA
              </label>
              <Input
                type="text"
                placeholder="e.g. yourname@okaxis"
                value={upiVpa}
                onChange={(e) => setUpiVpa(e.target.value)}
                className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-gold/50"
              />
            </div>
            <div className="sm:w-40">
              <label className="text-xs text-gray-400 mb-1.5 block">
                Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="0"
                min={1}
                max={summary.availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-gold/50"
              />
            </div>
            <div className="sm:self-end">
              <Button
                onClick={handleRequestPayout}
                disabled={submitting}
                className="bg-gold hover:bg-yellow-600 text-black font-semibold w-full sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Request Payout"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Ledger — Desktop */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">
          Transaction History
        </h3>

        <Card className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    UPI VPA
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    UTR Reference
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => {
                  const cfg = statusConfig[txn.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr
                      key={txn.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(txn.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-semibold">
                        ₹{txn.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                        {txn.upiVpa}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                        {txn.utrReference}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color} ${cfg.bg}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Transaction Ledger — Mobile Cards */}
        <div className="md:hidden space-y-3">
          {transactions.map((txn) => {
            const cfg = statusConfig[txn.status];
            const StatusIcon = cfg.icon;
            return (
              <Card
                key={txn.id}
                className="bg-white/5 border border-white/10 rounded-2xl"
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">
                      ₹{txn.amount.toLocaleString()}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {txn.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-mono">{txn.upiVpa}</span>
                    <span>
                      {new Date(txn.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  {txn.utrReference !== "—" && (
                    <p className="text-xs text-gray-600 font-mono">
                      UTR: {txn.utrReference}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
