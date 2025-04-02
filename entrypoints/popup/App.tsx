import { i18n } from '#i18n';
import React, { useEffect, useRef, useState } from 'react';
import { browser } from 'wxt/browser';
import ConfigPanel from '../../src/components/ConfigPanel';
import DownloadOptions from '../../src/components/DownloadOptions';
import QRCodeComponent, { QRCodeComponentRef } from '../../src/components/QRCodeComponent';
import { useQRStore } from '../../src/store/qrStore';
import './App.css';

// About组件，显示使用说明
const About: React.FC = () => {
  // 使用硬编码的数组，因为i18n不支持直接返回数组

  const aboutItems = [
    i18n.t('about.items.0'),
    i18n.t('about.items.1'),
    i18n.t('about.items.2'),
    i18n.t('about.items.3'),
    i18n.t('about.items.4'),
  ]
  console.log("%c Line:15 🥪 aboutItems", "color:#2eafb0", aboutItems);

  return (
    <div>
      <h3 className="text-lg font-medium mb-2 text-gray-800">{i18n.t('about.title')}</h3>
      <ul className="list-disc pl-5 text-sm text-gray-600">
        {aboutItems.map((item, index) => (
          <li key={index} className="mb-1">{item}</li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-center">
        <a
          href="https://github.com/crper/wxt-chrome-qrcode"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </a>
      </div>
    </div>
  );
};

function App() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const qrCodeRef = useRef<QRCodeComponentRef>(null!);

  // Get QR code configuration from store
  const {
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
  } = useQRStore();

  useEffect(() => {
    const getTempContent = async () => {
      setLoading(true);
      try {
        // 首先尝试从存储中获取临时内容
        const result = await browser.storage.local.get(['tempContent', 'qrTempContent']);
        console.log('从storage获取结果:', result);

        // 优先使用tempContent，如果不存在则尝试使用qrTempContent
        if (result.tempContent) {
          console.log('使用tempContent:', result.tempContent);
          setContent(result.tempContent);
          // 使用后清除临时内容
          await browser.storage.local.remove('tempContent');
        } else if (result.qrTempContent) {
          // 兼容旧版本
          console.log('使用qrTempContent:', result.qrTempContent);
          setContent(result.qrTempContent);
          // 使用后清除临时内容
          await browser.storage.local.remove('qrTempContent');
        } else {
          // 如果没有临时内容，则使用当前页面的URL
          const tabs = await browser.tabs.query({ active: true, currentWindow: true });
          if (tabs.length > 0 && tabs[0].url) {
            console.log('使用当前页面URL:', tabs[0].url);
            setContent(tabs[0].url);
          }
        }
      } catch (error) {
        console.error('获取内容失败:', error);
      } finally {
        setLoading(false);
      }
    };

    getTempContent();
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <div className="container mx-auto px-4 py-6 ">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {i18n.t('app.title')}
          </h1>
          <p className="text-center text-gray-600 mt-1">
            {i18n.t('app.subtitle')}
          </p>
        </header>

        <div className="flex justify-start md:flex-row gap-3">
          {/* 左侧：QR码预览和配置面板 */}
          <div className="md:w-3/5 flex flex-col">
            <div className="bg-white rounded-xl shadow-md p-5 mb-5" style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200">
                {i18n.t('app.sections.preview')}
              </h2>

              <div className="flex justify-center items-center min-h-[300px]">
                {loading ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                ) : content ? (
                  <div className="p-4 bg-gray-50 rounded-lg" style={{ pointerEvents: 'none' }}>
                    <QRCodeComponent
                      ref={qrCodeRef}
                      value={content}
                      ecLevel={ecLevel}
                      enableCORS={enableCORS}
                      size={size}
                      quietZone={quietZone}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      logoImage={logoImage}
                      logoWidth={logoWidth}
                      logoHeight={logoHeight}
                      logoOpacity={logoOpacity}
                      removeQrCodeBehindLogo={removeQrCodeBehindLogo}
                      logoPadding={logoPadding}
                      logoPaddingStyle={logoPaddingStyle}
                      qrStyle={qrStyle}
                    />
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v.01M8.5 6.5l.01-.01M5 10h.01M5 14h.01M8.5 17.5l.01-.01M12 20v.01M15.5 17.5l.01-.01M19 14h.01M19 10h.01M15.5 6.5l.01-.01M7 10h10v4H7v-4z" />
                    </svg>
                    <p>{i18n.t('app.emptyPreview')}</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ zIndex: 10 }}>
              <ConfigPanel
                ecLevel={ecLevel}
                setEcLevel={setEcLevel}
                enableCORS={enableCORS}
                setEnableCORS={setEnableCORS}
                size={size}
                setSize={setSize}
                quietZone={quietZone}
                setQuietZone={setQuietZone}
                bgColor={bgColor}
                setBgColor={setBgColor}
                fgColor={fgColor}
                setFgColor={setFgColor}
                logoImage={logoImage}
                setLogoImage={setLogoImage}
                logoWidth={logoWidth}
                setLogoWidth={setLogoWidth}
                logoHeight={logoHeight}
                setLogoHeight={setLogoHeight}
                logoOpacity={logoOpacity}
                setLogoOpacity={setLogoOpacity}
                removeQrCodeBehindLogo={removeQrCodeBehindLogo}
                setRemoveQrCodeBehindLogo={setRemoveQrCodeBehindLogo}
                logoPadding={logoPadding}
                setLogoPadding={setLogoPadding}
                logoPaddingStyle={logoPaddingStyle}
                setLogoPaddingStyle={setLogoPaddingStyle}
                qrStyle={qrStyle}
                setQrStyle={setQrStyle}
              />
            </div>
          </div>

          {/* 右侧：内容输入和下载选项 */}
          <div className="md:w-2/5 flex flex-col">
            <div className="bg-white rounded-xl shadow-md p-5 mb-5">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200">
                {i18n.t('app.sections.input')}
              </h2>
              <div className="mb-4">
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder={i18n.t('app.placeholder')}
                  className="w-full h-36 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p>{i18n.t('app.tip')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 mb-5">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200">
                {i18n.t('app.sections.download')}
              </h2>
              <DownloadOptions qrCodeRef={qrCodeRef} content={content} />
            </div>

            <div className="bg-white rounded-xl shadow-md p-5">
              <About />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
