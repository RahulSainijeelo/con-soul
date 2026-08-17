import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Star, Eye, Trash2 } from "lucide-react";
import { ExtendedReview } from "./useManageReviews";

interface ReviewTableProps {
  reviews: ExtendedReview[];
  loading: boolean;
  onView: (review: ExtendedReview) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (review: ExtendedReview) => void;
}

export function ReviewTable({
  reviews,
  loading,
  onView,
  onApprove,
  onReject,
  onDelete,
}: ReviewTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600/20 text-green-400";
      case "pending":
        return "bg-amber-600/20 text-amber-400";
      case "rejected":
        return "bg-red-600/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border overflow-hidden bg-black border-[#333]">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#111] border-[#333]">
              <TableHead className="text-gray-400 font-semibold">
                View
              </TableHead>
              <TableHead className="text-gray-400 font-semibold">
                Customer Name
              </TableHead>
              <TableHead className="text-gray-400 font-semibold">
                Rating
              </TableHead>
              <TableHead className="text-gray-400 font-semibold">
                Date
              </TableHead>
              <TableHead className="text-gray-400 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-right text-gray-400 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-[#333]">
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded bg-gray-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 bg-gray-800" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4 rounded bg-gray-800" />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 bg-gray-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full bg-gray-800" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded bg-gray-800" />
                    <Skeleton className="h-8 w-8 rounded bg-gray-800" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center bg-black border-[#333]">
        <div className="text-6xl mb-4 opacity-50">⭐</div>
        <h3 className="text-xl font-semibold mb-2 text-white">
          No Reviews Yet
        </h3>
        <p className="text-gray-400">
          Customer reviews will appear here once they're submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden bg-black border-[#333]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#111] border-[#333]">
            <TableHead className="font-semibold text-gray-400">
              View
            </TableHead>
            <TableHead className="font-semibold text-gray-400">
              Customer Name
            </TableHead>
            <TableHead className="font-semibold text-gray-400">
              Rating
            </TableHead>
            <TableHead className="font-semibold text-gray-400">
              Date
            </TableHead>
            <TableHead className="font-semibold text-gray-400">
              Status
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-400">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review, index) => {
            const statusColors = getStatusColors(review.status);

            return (
              <TableRow
                key={review.id}
                className={`hover:bg-white/5 transition-colors border-[#333] ${index % 2 === 0 ? 'bg-black' : 'bg-[#0a0a0a]'}`}
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(review)}
                    aria-label="View details"
                    className="hover:bg-blue-500/10 text-blue-400 rounded-md"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-white text-sm">
                  {review.userName}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600 fill-transparent'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-400">
                      {review.rating}/5
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400 text-[13px]">
                  {formatDate(review.time)}
                </TableCell>
                <TableCell>
                  <Badge className={`font-medium text-xs px-3 py-1 border-none rounded-full ${statusColors}`}>
                    {review.status.charAt(0).toUpperCase() +
                      review.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    {review.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-green-500/10 border-green-500/30 text-green-400 bg-transparent"
                          onClick={() => onApprove(review.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-red-500/10 border-red-500/30 text-red-400 bg-transparent"
                          onClick={() => onReject(review.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {review.status !== "pending" && (
                      <div className="text-xs px-2 py-1 rounded-md bg-gray-800 text-gray-400">
                        {review.status === "approved"
                          ? "✓ Approved"
                          : "✗ Rejected"}
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-500/10 text-red-400"
                      onClick={() => onDelete(review)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
