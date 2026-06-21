import { ProcessedImage, formatSize, calculateSavings } from '@/lib/imageProcessor';

interface ImageListProps {
  images: ProcessedImage[];
  onRemove: (id: string) => void;
  onDownloadOne: (image: ProcessedImage) => void;
}

export default function ImageList({ images, onRemove, onDownloadOne }: ImageListProps) {
  if (images.length === 0) return null;

  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalProcessed = images.reduce((sum, img) => sum + img.processedSize, 0);
  const totalSavings = calculateSavings(totalOriginal, totalProcessed);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">
          Results ({images.length})
        </h3>
        <div className="text-sm text-slate-600">
          {totalSavings.isSaving ? 'Total saved: ' : 'Size change: '}
          <span className={`font-semibold ${totalSavings.isSaving ? 'text-green-600' : 'text-amber-600'}`}>
            {totalSavings.isSaving ? `-${totalSavings.text}` : `+${totalSavings.text}`}
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {images.map((img) => {
          const savings = calculateSavings(img.originalSize, img.processedSize);
          return (
            <div
              key={img.id}
              className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <img
                src={img.url}
                alt={img.fileName}
                className="w-16 h-16 object-cover rounded-md border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{img.fileName}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{formatSize(img.originalSize)}</span>
                  <span>→</span>
                  <span className={savings.isSaving ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>{formatSize(img.processedSize)}</span>
                  <span className={savings.isSaving ? 'text-green-600' : 'text-amber-600'}>
                    {savings.isSaving ? `(-${savings.text})` : `(+${savings.text})`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDownloadOne(img)}
                  className="px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => onRemove(img.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
