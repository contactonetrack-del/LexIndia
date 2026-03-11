'use client';

import React, { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  lawyerName: string;
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onClose, appointmentId, lawyerName, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, rating, comment }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      toast.success('Review submitted successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg text-center flex-1">Rate Your Consultation</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors absolute right-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
           <p className="text-center text-sm text-gray-600 mb-6">
             How was your experience with <span className="font-semibold text-gray-900">{lawyerName}</span>?
           </p>

           <div className="flex justify-center gap-2 mb-8">
             {[1, 2, 3, 4, 5].map((star) => (
               <button
                 key={star}
                 type="button"
                 onClick={() => setRating(star)}
                 onMouseEnter={() => setHoverRating(star)}
                 onMouseLeave={() => setHoverRating(0)}
                 className={`p-2 transition-all ${
                   (hoverRating || rating) >= star ? 'text-amber-400 scale-110' : 'text-gray-200 scale-100 hover:text-amber-200'
                 }`}
               >
                 <Star className="w-10 h-10 fill-current" />
               </button>
             ))}
           </div>

           <div className="mb-6">
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Additional Comments (Optional)
             </label>
             <textarea
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               placeholder="Share details of your experience to help others..."
               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent resize-none text-sm text-gray-800"
               rows={4}
             />
           </div>

           <button
             type="submit"
             disabled={isSubmitting || rating === 0}
             className="w-full bg-[#1E3A8A] text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
           >
             {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
             {isSubmitting ? 'Submitting...' : 'Submit Review'}
           </button>
        </form>
      </div>
    </div>
  );
}
