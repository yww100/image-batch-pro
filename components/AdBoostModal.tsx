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

  const title = reason === 'limit' ? '需要处理更多图片？' : '需要 ZIP 批量下载？';
  const description =
    reason === 'limit'
      ? `看一段广告，本批可额外处理 ${AD_BOOST_BONUS} 张图片。或升级 Pro，每批 500 张。`
      : `看一段广告，解锁本次 ZIP 批量下载。或升级 Pro，永久解锁 ZIP 导出。`;

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
            ✅ 已增加 {AD_BOOST_BONUS} 张额度！正在刷新...
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleWatchAd}
              disabled={watching || !canWatchAd()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              {watching ? '广告播放中...' : `看广告（+${AD_BOOST_BONUS} 张）`}
            </button>

            <button
              onClick={onUpgrade}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Crown className="w-4 h-4" />
              升级 Pro
            </button>
          </div>
        )}

        <p className="text-xs text-center text-slate-500">
          {canWatchAd() ? `今日还剩 ${boostsLeft} 次广告激励` : '今日广告激励已用完'}
          {getAdBoostCount() > 0 && ` · 当前可用 ${getAdBoostCount()} 张额外额度`}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          稍后再说
        </button>
      </div>
    </div>
  );
}
