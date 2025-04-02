import { i18n } from '#i18n';
import React, { useState } from 'react';
import { QRCodeComponentRef } from './QRCodeComponent';

interface DownloadOptionsProps {
  qrCodeRef: React.RefObject<QRCodeComponentRef>;
  content: string;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ qrCodeRef, content }) => {
  const [format, setFormat] = useState<'png' | 'jpg' | 'webp'>('png');

  const handleDownload = () => {
    if (!qrCodeRef.current || !content) return;

    try {
      // 使用QRCodeComponent提供的downloadQRCode方法
      const fileName = `qrcode_${Date.now()}.${format}`;
      qrCodeRef.current.downloadQRCode(format, fileName);
      console.log(`二维码已下载为${format}格式: ${fileName}`);
    } catch (error) {
      console.error('下载二维码失败:', error);

      // 备用下载方法
      const canvasElement = qrCodeRef.current.getCanvas();
      if (!canvasElement) return;

      const link = document.createElement('a');

      if (format === 'jpg') {
        // For JPG format
        const dataUrl = canvasElement.toDataURL('image/jpeg', 0.8);
        link.download = `qrcode_${Date.now()}.jpg`;
        link.href = dataUrl;
      } else if (format === 'webp') {
        // For WEBP format
        const dataUrl = canvasElement.toDataURL('image/webp', 0.8);
        link.download = `qrcode_${Date.now()}.webp`;
        link.href = dataUrl;
      } else {
        // Default to PNG
        const dataUrl = canvasElement.toDataURL('image/png');
        link.download = `qrcode_${Date.now()}.png`;
        link.href = dataUrl;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.t('downloadOptions.formatLabel')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setFormat('png')}
            className={`py-2 px-3 text-xs rounded-md focus:outline-none ${
              format === 'png'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {i18n.t('downloadOptions.formats.png')}
          </button>
          <button
            type="button"
            onClick={() => setFormat('jpg')}
            className={`py-2 px-3 text-xs rounded-md focus:outline-none ${
              format === 'jpg'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {i18n.t('downloadOptions.formats.jpg')}
          </button>
          <button
            type="button"
            onClick={() => setFormat('webp')}
            className={`py-2 px-3 text-xs rounded-md focus:outline-none ${
              format === 'webp'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {i18n.t('downloadOptions.formats.webp')}
          </button>
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={!content}
        className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          content
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {i18n.t('downloadOptions.download')}
      </button>
    </div>
  );
};

export default DownloadOptions;