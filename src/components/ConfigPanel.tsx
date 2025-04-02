import { i18n } from '#i18n';
import React, { useState } from 'react';
import {
  ErrorCorrectionLevel,
  LogoPaddingStyle,
  QrStyle
} from '../store/qrStore';

interface ConfigPanelProps {
  ecLevel: ErrorCorrectionLevel;
  setEcLevel: (level: ErrorCorrectionLevel) => void;
  enableCORS: boolean;
  setEnableCORS: (enableCORS: boolean) => void;
  size: number;
  setSize: (size: number) => void;
  quietZone: number;
  setQuietZone: (quietZone: number) => void;
  bgColor: string;
  setBgColor: (bgColor: string) => void;
  fgColor: string;
  setFgColor: (fgColor: string) => void;
  logoImage?: string;
  setLogoImage: (logoImage: string | undefined) => void;
  logoWidth?: number;
  setLogoWidth: (logoWidth: number | undefined) => void;
  logoHeight?: number;
  setLogoHeight: (logoHeight: number | undefined) => void;
  logoOpacity: number;
  setLogoOpacity: (logoOpacity: number) => void;
  removeQrCodeBehindLogo: boolean;
  setRemoveQrCodeBehindLogo: (removeQrCodeBehindLogo: boolean) => void;
  logoPadding: number;
  setLogoPadding: (logoPadding: number) => void;
  logoPaddingStyle: LogoPaddingStyle;
  setLogoPaddingStyle: (logoPaddingStyle: LogoPaddingStyle) => void;
  qrStyle: QrStyle;
  setQrStyle: (qrStyle: QrStyle) => void;
}


const ConfigPanel: React.FC<ConfigPanelProps> = ({
  ecLevel,
  setEcLevel,
  enableCORS,
  setEnableCORS,
  size,
  setSize,
  quietZone,
  setQuietZone,
  bgColor,
  setBgColor,
  fgColor,
  setFgColor,
  logoImage,
  setLogoImage,
  logoWidth,
  setLogoWidth,
  logoHeight,
  setLogoHeight,
  logoOpacity,
  setLogoOpacity,
  removeQrCodeBehindLogo,
  setRemoveQrCodeBehindLogo,
  logoPadding,
  setLogoPadding,
  logoPaddingStyle,
  setLogoPaddingStyle,
  qrStyle,
  setQrStyle
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  // 根据浏览器语言自动选择语言，不提供切换功能
  const language = navigator.language.startsWith('zh') ? 'zh' : 'en';

  // 获取指定路径下的dddd翻译文本


  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const panelStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 20,
    pointerEvents: 'auto'
  };

  const inputStyle: React.CSSProperties = {
    pointerEvents: 'auto'
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-white rounded-lg shadow p-2" style={panelStyle}>
      {/* 标题 */}
      <div className="mb-1">
        <h3 className="text-sm font-medium text-gray-800">
          {i18n.t('configPanel.title')}
        </h3>
      </div>

      {/* 基本设置折叠面板 */}
      <div className="mb-1 border-b border-gray-200">
        <button
          className="w-full flex justify-between items-center py-1 text-xs font-medium text-gray-700 hover:text-blue-600"
          onClick={() => toggleSection('basic')}
          style={inputStyle}
        >
          <span>{i18n.t('configPanel.basic.title')}</span>
          <svg
            className={`w-3 h-3 transition-transform ${expandedSection === 'basic' ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === 'basic' && (
          <div className="py-1 space-y-1">
            {/* 纠错级别 */}
            <div className="mb-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {i18n.t('configPanel.basic.ecLevel')}
              </label>
              <select
                value={ecLevel}
                onChange={(e) => setEcLevel(e.target.value as ErrorCorrectionLevel)}
                className="w-full px-2 py-1 text-xs text-gray-700 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={inputStyle}
              >
                <option value="L">{i18n.t('configPanel.basic.ecLevels.L')}</option>
                <option value="M">{i18n.t('configPanel.basic.ecLevels.M')}</option>
                <option value="Q">{i18n.t('configPanel.basic.ecLevels.Q')}</option>
                <option value="H">{i18n.t('configPanel.basic.ecLevels.H')}</option>
              </select>
            </div>

            {/* 二维码大小 */}
            <div className="mb-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {i18n.t('configPanel.basic.size')} ({size}px)
              </label>
              <input
                type="range"
                min="150"
                max="400"
                step="10"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
                style={inputStyle}
              />
            </div>

            {/* 边距 */}
            <div className="mb-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {i18n.t('configPanel.basic.margin')} ({quietZone}px)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={quietZone}
                onChange={(e) => setQuietZone(Number(e.target.value))}
                className="w-full"
                style={inputStyle}
              />
            </div>

            {/* QR样式 */}
            <div className="mb-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {i18n.t('configPanel.basic.qrStyle')}
              </label>
              <select
                value={qrStyle}
                onChange={(e) => setQrStyle(e.target.value as QrStyle)}
                className="w-full px-2 py-1 text-xs text-gray-700 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={inputStyle}
              >
                <option value="squares">{i18n.t('configPanel.basic.qrStyles.squares')}</option>
                <option value="dots">{i18n.t('configPanel.basic.qrStyles.dots')}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 颜色设置折叠面板 */}
      <div className="mb-1 border-b border-gray-200">
        <button
          className="w-full flex justify-between items-center py-1 text-xs font-medium text-gray-700 hover:text-blue-600"
          onClick={() => toggleSection('colors')}
          style={inputStyle}
        >
          <span>{i18n.t('configPanel.colors.title')}</span>
          <svg
            className={`w-3 h-3 transition-transform ${expandedSection === 'colors' ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === 'colors' && (
          <div className="py-1 space-y-1">
            {/* 前景色 */}
            <div className="mb-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {i18n.t('configPanel.colors.foreground')}
              </label>
              <div className="flex">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-6 w-6 p-0 border-none mr-2"
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs text-gray-700 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 背景色 */}
            <div className="mb-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {i18n.t('configPanel.colors.background')}
              </label>
              <div className="flex">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-6 w-6 p-0 border-none mr-2"
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs text-gray-700 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logo设置折叠面板 */}
      <div className="mb-1 border-b border-gray-200">
        <button
          className="w-full flex justify-between items-center py-1 text-xs font-medium text-gray-700 hover:text-blue-600"
          onClick={() => toggleSection('logo')}
          style={inputStyle}
        >
          <span>{i18n.t('configPanel.logo.title')}</span>
          <svg
            className={`w-3 h-3 transition-transform ${expandedSection === 'logo' ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === 'logo' && (
          <div className="py-1 space-y-1">
            {/* Logo上传 */}
            <div className="mb-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {i18n.t('configPanel.logo.upload')}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full px-2 py-1 text-xs text-gray-700 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={inputStyle}
              />
              {logoImage && (
                <div className="mt-1 flex items-center">
                  <img src={logoImage} alt="Logo Preview" className="h-6 w-6 mr-2" />
                  <button
                    onClick={() => setLogoImage(undefined)}
                    className="text-red-500 text-xs"
                    style={inputStyle}
                  >
                    {i18n.t('configPanel.logo.remove')}
                  </button>
                </div>
              )}
            </div>

            {logoImage && (
              <>
                {/* Logo宽度 */}
                <div className="mb-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {i18n.t('configPanel.logo.width')} ({logoWidth || Math.round(size * 0.2)}px)
                  </label>
                  <input
                    type="range"
                    min={Math.round(size * 0.05)}
                    max={Math.round(size * 0.4)}
                    step="1"
                    value={logoWidth || Math.round(size * 0.2)}
                    onChange={(e) => setLogoWidth(Number(e.target.value))}
                    className="w-full"
                    style={inputStyle}
                  />
                </div>

                {/* Logo透明度 */}
                <div className="mb-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {i18n.t('configPanel.logo.opacity')} ({logoOpacity.toFixed(1)})
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={logoOpacity}
                    onChange={(e) => setLogoOpacity(Number(e.target.value))}
                    className="w-full"
                    style={inputStyle}
                  />
                </div>

                {/* 移除Logo后面的QR码 */}
                <div className="mb-1 flex items-center">
                  <input
                    type="checkbox"
                    id="removeQrCodeBehindLogo"
                    checked={removeQrCodeBehindLogo}
                    onChange={(e) => setRemoveQrCodeBehindLogo(e.target.checked)}
                    className="mr-2"
                    style={inputStyle}
                  />
                  <label htmlFor="removeQrCodeBehindLogo" className="text-xs font-medium text-gray-700">
                    {i18n.t('configPanel.logo.removeQrBehind')}
                  </label>
                </div>

                {/* Logo内边距样式 */}
                <div className="mb-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {i18n.t('configPanel.logo.paddingStyle')}
                  </label>
                  <select
                    value={logoPaddingStyle}
                    onChange={(e) => setLogoPaddingStyle(e.target.value as LogoPaddingStyle)}
                    className="w-full px-2 py-1 text-xs text-gray-700 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    style={inputStyle}
                  >
                    <option value="square">{i18n.t('configPanel.logo.paddingStyles.square')}</option>
                    <option value="circle">{i18n.t('configPanel.logo.paddingStyles.circle')}</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 高级设置折叠面板 */}
      <div className="mb-1">
        <button
          className="w-full flex justify-between items-center py-1 text-xs font-medium text-gray-700 hover:text-blue-600"
          onClick={() => toggleSection('advanced')}
          style={inputStyle}
        >
          <span>{i18n.t('configPanel.advanced.title')}</span>
          <svg
            className={`w-3 h-3 transition-transform ${expandedSection === 'advanced' ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === 'advanced' && (
          <div className="py-1 space-y-1">
            {/* 启用CORS */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableCORS"
                checked={enableCORS}
                onChange={(e) => setEnableCORS(e.target.checked)}
                className="mr-2"
                style={inputStyle}
              />
              <label htmlFor="enableCORS" className="text-xs font-medium text-gray-700">
                {i18n.t('configPanel.advanced.enableCORS')}
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigPanel;