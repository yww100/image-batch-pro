import { useState } from 'react';
import { Play, Crown, X, Zap } from 'lucide-react';
import { watchAdForBoost, canWatchAd, getAdBoostCount, getAdBoostUsedToday, MAX_AD_BOOST_PER_DAY, AD_BOOST_BONUS } from '@/lib/pro';

interface AdBoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'limit' | 'zip';
  onUpgrade: () => void;
}

export default function AdBoostModal({ isOpen, onClose, reason, onUpgrade }: AdBoostModalProps) {
  const [watching, setWatching] = useState(false);
  const [watched, setWatched] = useState(false);

  if (!isOpen) return null;

  const handleWatchAd = () => {
    setWatching(true);
    // Simulate ad watch (replace with real ad provider)
    setTimeout(() => {
      const success = watchAdForBoost();
      setWatching(false);
      setWatched(success);
      if (success) {
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      }
    }, 2500);
  };

  const title = reason === 'limit' ? 'Need more images?' : 'Want ZIP download?';
  const description =
    reason === 'limit'
      ? `Watch a short ad to process ${AD_BOOST_BONUS} more images this batch. Or upgrade to Pro for 500 per batch.`
      : `Watch a short ad to unlock ZIP download for this session. Or upgrade to Pro for unlimited ZIP exports.`;

  const boostsLeft = MAX_AD_BOOST_PER_DAY - getAdBoostUsedToday();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-600 mt-2 text-sm">{description}</p>
        </div>

        {watched ? (
          <div className="text-center text-green-600 font-medium py-2">
            ✅ +{AD_BOOST_BONUS} images added! Reloading...
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleWatchAd}
              disabled={watching || !canWatchAd()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              {watching ? 'Playing ad...' : `Watch ad (+${AD_BOOST_BONUS} images)`}
            </button>

            <button
              onClick={onUpgrade}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </button>
          </div>
        )}

        <p className="text-xs text-center text-slate-500">
          {canWatchAd() ? `${boostsLeft} ad boosts left today` : 'No more ad boosts today'}
          {getAdBoostCount() > 0 && ` · ${getAdBoostCount()} bonus images available`}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
