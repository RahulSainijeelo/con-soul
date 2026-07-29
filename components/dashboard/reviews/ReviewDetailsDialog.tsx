import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ExtendedReview } from "./useManageReviews";

export function ReviewDetailsDialog({
  review,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: {
  review: ExtendedReview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md responsive-portfolio-modal">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(review.time)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Customer</h3>
              <p className="mt-1">{review.userName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Rating</h3>
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {(review.certifiedHighlight || review.comment) && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h3 className="font-semibold text-sm text-gray-500">Certified Highlight / Comment</h3>
              <p className="mt-1 text-gray-800 italic">"{review.certifiedHighlight || review.comment}"</p>
            </div>
          )}

          {review.honestTake && (
            <div className="bg-red-50 p-3 rounded-md border border-red-100">
              <h3 className="font-semibold text-sm text-red-600">Honest Take</h3>
              <p className="mt-1 text-gray-800">{review.honestTake}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {review.vibeTags && review.vibeTags.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Vibe Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {review.vibeTags.map(tag => (
                    <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            
            {(review.personalityBadge || review.fomoScore) && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Badges</h3>
                <div className="flex flex-col gap-1">
                  {review.personalityBadge && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded truncate">{review.personalityBadge.split('—')[0]}</span>}
                  {review.fomoScore && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded truncate">{review.fomoScore.split('—')[0]}</span>}
                </div>
              </div>
            )}
          </div>

          {(review.squadChemistry !== undefined || review.consoulHost !== undefined || review.tripVibe !== undefined) && (
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-2">Metrics</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b pb-1"><span>Squad Chemistry</span> <strong>{review.squadChemistry?.toFixed(1) || 'N/A'}</strong></div>
                <div className="flex justify-between border-b pb-1"><span>Consoul Host</span> <strong>{review.consoulHost?.toFixed(1) || 'N/A'}</strong></div>
                <div className="flex justify-between border-b pb-1"><span>Trip Vibe</span> <strong>{review.tripVibe?.toFixed(1) || 'N/A'}</strong></div>
              </div>
            </div>
          )}
          {review.images && review.images.length > 0 && (
            <div>
              <h3 className="font-semibold">Images</h3>
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Review image ${idx + 1}`}
                    className="h-20 w-20 object-cover rounded-md border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="font-semibold">Status</h3>
            {review.status === "approved" && (
              <Badge className="mt-1 bg-green-500 hover:bg-green-600">
                Approved
              </Badge>
            )}
            {review.status === "pending" && (
              <Badge className="mt-1 bg-blue-500 hover:bg-blue-600">
                Pending
              </Badge>
            )}
            {review.status === "rejected" && (
              <Badge className="mt-1 bg-red-500 hover:bg-red-600">
                Rejected
              </Badge>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          {review.status === "pending" && (
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  onApprove(review.id);
                  onOpenChange(false);
                }}
                className="bg-green-500 hover:bg-green-600"
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  onReject(review.id);
                  onOpenChange(false);
                }}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Reject
              </Button>
            </div>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
