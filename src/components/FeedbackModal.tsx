import { FEEDBACK_ENDPOINT } from 'astro:env/client';
import { MessageSquare, Send, X } from 'lucide-react';
import { useState } from 'react';

interface FeedbackModalProps {
  showFeedback: boolean;
  onClose: () => void;
}

const FeedbackModal = ({ showFeedback, onClose }: FeedbackModalProps) => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Format message
      const message = `🔔 New Feedback from White Noise Now

📧 Email: ${email.trim() || 'Anonymous'}

💬 Feedback:
${feedback.trim()}`;

      // Send directly to Telegram Bot API
      const response = await fetch(
        FEEDBACK_ENDPOINT as string,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
          }),
        },
      );

      if (response.ok) {
        setSubmitStatus('success');
        setEmail('');
        setFeedback('');
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Telegram API error:', errorData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showFeedback) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4 no-drag">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare size={24} className="text-teal-400" />
            <h2 className="text-xl font-semibold text-white">Send Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email <span className="text-slate-500 text-xs">(optional)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Feedback <span className="text-red-400 text-xs">*</span>
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think, report bugs, or suggest features..."
              rows={5}
              required
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              disabled={isSubmitting}
            />
          </div>

          {submitStatus === 'success' && (
            <div className="p-3 bg-teal-900/30 border border-teal-700 rounded-lg text-teal-300 text-sm">
              ✓ Thank you for your feedback!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              Failed to send feedback. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !feedback.trim()}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Feedback
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500 text-center">
          Your feedback helps us improve White Noise Now
        </p>
      </div>
    </div>
  );
};

export default FeedbackModal;
