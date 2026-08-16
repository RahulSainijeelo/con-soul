"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Share2, Edit } from "lucide-react";
import Link from "next/link";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
}

export function ConfirmationDialog({ isOpen, onClose, articleTitle }: ConfirmationDialogProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: articleTitle,
        text: 'Check out this article!',
        url: window.location.origin + '/article/sample-slug',
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.origin + '/article/sample-slug');
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Article Published Successfully!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Your article <strong>"{articleTitle}"</strong> has been published and is now live.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">Article URL:</p>
            <code className="text-sm bg-white p-2 rounded border block">
              {window.location.origin}/article/sample-slug
            </code>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleShare}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Share2 size={16} />
              Share Article
            </Button>
            
            <Link href="/admin/articles" className="flex-1">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Edit size={16} />
                Manage Articles
              </Button>
            </Link>
          </div>

          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full"
          >
            Create Another Article
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
