import React, { useState } from 'react';
import { X, ShieldCheck, Send, CheckCircle2, AlertCircle, Building2, Lock } from 'lucide-react';
import { Item } from '../types';

interface SafeContactModalProps {
  item: Item | null;
  onClose: () => void;
}

export const SafeContactModal: React.FC<SafeContactModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const isLost = item.type === 'lost';
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [message, setMessage] = useState(
    isLost
      ? `Hi ${item.contactName}, I believe I may have found your ${item.title} on campus. I'd like to verify ownership details with you.`
      : `Hi ${item.contactName}, I believe the ${item.title} you reported finding matches an item I lost. I can provide identifying features to confirm ownership.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, campus email, and message.');
      return;
    }
    if (!senderEmail.includes('@')) {
      setErrorMessage('Please provide a valid university email address.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    // Simulate safe dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Safe Campus Relay Contact</h3>
              <p className="text-[11px] text-slate-500">Item: {item.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Inquiry Dispatched Safely!</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your inquiry has been relayed through the university proxy system to{' '}
              <strong className="text-slate-800">{item.contactName}</strong>. A copy was sent to{' '}
              <span className="font-mono text-xs">{senderEmail}</span>.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Recommended Next Step:
              </div>
              <p>
                When coordinating pickup, choose an official campus location like the{' '}
                <strong>Main Library Front Desk</strong> or <strong>Student Union Info Counter</strong>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Privacy notice banner */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold">Privacy Protection:</span> Your private phone and personal identity remain shielded until both parties verify ownership credentials.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Campus Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@campus.edu"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Contact Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Proof of Ownership / Identifying Clues *
              </label>
              <input
                type="text"
                placeholder="e.g. Serial prefix, lock passcode hint, scratch on bottom left, or lock screen photo"
                value={proofDetails}
                onChange={(e) => setProofDetails(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Never disclose full secret passwords; provide verifiable physical details only the true owner would know.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message to Reporter *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
