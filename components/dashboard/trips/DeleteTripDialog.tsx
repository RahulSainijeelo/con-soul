import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { EditTrip } from "@/types/Trip";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface DeleteTripDialogProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDeleteTrip: () => void;
  selectedTrip: EditTrip | null;
  loading: boolean;
}

const DeleteTripDialog: React.FC<DeleteTripDialogProps> = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteTrip,
  selectedTrip,
  loading,
}) => (
  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
    <DialogContent className="sm:max-w-md bg-gray-900 border-white/10">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-400">
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a3 3 0 003 3h2a3 3 0 003-3V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.414V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.586L3.414 15.414a1 1 0 01-1.414-1.414L4 11.5V5z" clipRule="evenodd" />
            </svg>
          </div>
          Delete Trip
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Are you sure you want to delete this trip? This action cannot be undone and will permanently remove the trip and all its content.
        </DialogDescription>
      </DialogHeader>

      {selectedTrip && (
        <div className="py-4 border border-red-500/30 rounded-lg bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            {selectedTrip.images && selectedTrip.images.length > 0 && (
              <img
                src={selectedTrip.images[0].url}
                alt={selectedTrip.title}
                className="w-16 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-white line-clamp-2">{selectedTrip.title}</p>
              <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedTrip.destination}</span>
                </div>
                {selectedTrip.startDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(selectedTrip.startDate), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <DialogFooter className="gap-2">
        <Button
          variant="outline"
          onClick={() => setIsDeleteDialogOpen(false)}
          disabled={loading}
          className="border-white/10 text-gray-300 hover:bg-white/5"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteTrip}
          disabled={loading}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
        >
          {loading && <Spinner />}
          {loading ? "Deleting..." : "Delete Trip"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteTripDialog;
