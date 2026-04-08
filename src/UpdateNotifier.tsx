import { useEffect, useState } from 'react';
import { AlertCircle, Download, RefreshCw } from 'lucide-react';

export default function UpdateNotifier() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!window.electron) return;

    // Update mavjud bo'lganda
    window.electron.onUpdateAvailable(() => {
      console.log('📦 Yangi versiya mavjud!');
      setUpdateAvailable(true);
    });

    // Update yuklab olinganda
    window.electron.onUpdateDownloaded(() => {
      console.log('✅ Update yuklab olindi!');
      setUpdateDownloaded(true);
      setUpdateAvailable(false);
    });
  }, []);

  const handleRestart = async () => {
    setIsUpdating(true);
    try {
      await window.electron?.restartApp?.();
    } catch (error) {
      console.error('Restart failed:', error);
      setIsUpdating(false);
    }
  };

  if (!updateAvailable && !updateDownloaded) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-blue-200 p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        {updateDownloaded ? (
          <RefreshCw className="w-5 h-5 text-green-600 mt-0.5 animate-spin" />
        ) : (
          <Download className="w-5 h-5 text-blue-600 mt-0.5" />
        )}

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {updateDownloaded ? 'Update Tayyor!' : 'Yangi Versiya Mavjud'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {updateDownloaded
              ? 'Dasturni qayta ishga tushiring.'
              : 'Yangi version yuklanmoqda...'}
          </p>
        </div>

        {updateDownloaded && (
          <button
            onClick={handleRestart}
            disabled={isUpdating}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Qayta ishga tushmoqda...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Qayta Ishga Tushirish
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

