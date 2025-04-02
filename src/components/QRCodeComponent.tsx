import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';
import {
  CustomCornerRadii,
  CustomEyeColor,
  ErrorCorrectionLevel,
  LogoPaddingStyle,
  QrStyle
} from '../store/qrStore';

export interface QRCodeComponentRef {
  downloadQRCode: (format: 'png' | 'jpg' | 'webp', fileName?: string) => void;
  getCanvas: () => HTMLCanvasElement | null;
}

// 移除QRCodeComponentRefType类型定义，直接使用QRCodeComponentRef

interface QRCodeComponentProps {
  value: string;
  ecLevel: ErrorCorrectionLevel;
  enableCORS: boolean;
  size: number;
  quietZone: number;
  bgColor: string;
  fgColor: string;
  logoImage?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoOpacity: number;
  removeQrCodeBehindLogo: boolean;
  logoPadding: number;
  logoPaddingStyle: LogoPaddingStyle;
  qrStyle: QrStyle;
  eyeRadius?: CustomCornerRadii | [CustomCornerRadii, CustomCornerRadii, CustomCornerRadii];
  eyeColor?: CustomEyeColor | [CustomEyeColor, CustomEyeColor, CustomEyeColor];
}

const QRCodeComponent = forwardRef<QRCodeComponentRef, QRCodeComponentProps>((props, ref) => {
  const qrRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    downloadQRCode: (format: 'png' | 'jpg' | 'webp', fileName?: string) => {
      if (qrRef.current) {
        qrRef.current.download(format, fileName || `qrcode.${format}`);
      }
    },
    getCanvas: () => {
      // 获取QRCode组件内部的canvas元素
      if (qrRef.current) {
        const canvas = qrRef.current.canvas;
        return canvas ? canvas : null;
      }
      return null;
    }
  }));

  return (
    <div className="flex flex-col items-center" style={{ pointerEvents: 'none' }}>
      <QRCode
        ref={qrRef}
        id="react-qrcode"
        {...props}
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
});

QRCodeComponent.displayName = 'QRCodeComponent';

// 导出下载方法供其他组件使用
export const downloadQR = (
  qrRef: React.RefObject<QRCodeComponentRef>,
  fileType: 'png' | 'jpg' | 'webp' = 'png',
  fileName?: string
) => {
  if (qrRef.current) {
    qrRef.current.downloadQRCode(fileType, fileName || `qrcode.${fileType}`);
  }
};

export default QRCodeComponent;