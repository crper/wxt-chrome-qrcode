import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type QrStyle = 'squares' | 'dots';
export type LogoPaddingStyle = 'square' | 'circle';

// 自定义类型定义
export type InnerOuterRadii = {
    inner: number | [number, number, number, number];
    outer: number | [number, number, number, number];
};

export type CustomCornerRadii = number | [number, number, number, number] | InnerOuterRadii;

export type CustomEyeColor = string | {
    outer: string;
    inner: string;
};

interface QRConfig {
    value: string;
    ecLevel: ErrorCorrectionLevel;
    enableCORS: boolean;
    size: number;
    quietZone: number;
    bgColor: string;
    fgColor: string;
    logoImage?: string; // base64 encoded image
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

interface QRState extends QRConfig {
    setValue: (value: string) => void;
    setEcLevel: (level: ErrorCorrectionLevel) => void;
    setEnableCORS: (enableCORS: boolean) => void;
    setSize: (size: number) => void;
    setQuietZone: (quietZone: number) => void;
    setBgColor: (bgColor: string) => void;
    setFgColor: (fgColor: string) => void;
    setLogoImage: (logoImage: string | undefined) => void;
    setLogoWidth: (logoWidth: number | undefined) => void;
    setLogoHeight: (logoHeight: number | undefined) => void;
    setLogoOpacity: (logoOpacity: number) => void;
    setRemoveQrCodeBehindLogo: (removeQrCodeBehindLogo: boolean) => void;
    setLogoPadding: (logoPadding: number) => void;
    setLogoPaddingStyle: (logoPaddingStyle: LogoPaddingStyle) => void;
    setQrStyle: (qrStyle: QrStyle) => void;
    setEyeRadius: (eyeRadius: CustomCornerRadii | [CustomCornerRadii, CustomCornerRadii, CustomCornerRadii] | undefined) => void;
    setEyeColor: (eyeColor: CustomEyeColor | [CustomEyeColor, CustomEyeColor, CustomEyeColor] | undefined) => void;
    resetConfig: () => void;
}

const defaultConfig: QRConfig = {
    value: '',
    ecLevel: 'M',
    enableCORS: false,
    size: 200,
    quietZone: 10,
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    logoOpacity: 1,
    removeQrCodeBehindLogo: false,
    logoPadding: 0,
    logoPaddingStyle: 'square',
    qrStyle: 'squares',
};

export const useQRStore = create<QRState>()(
    persist(
        (set) => ({
            ...defaultConfig,
            setValue: (value) => set({ value }),
            setEcLevel: (ecLevel) => set({ ecLevel }),
            setEnableCORS: (enableCORS) => set({ enableCORS }),
            setSize: (size) => set({ size }),
            setQuietZone: (quietZone) => set({ quietZone }),
            setBgColor: (bgColor) => set({ bgColor }),
            setFgColor: (fgColor) => set({ fgColor }),
            setLogoImage: (logoImage) => set({ logoImage }),
            setLogoWidth: (logoWidth) => set({ logoWidth }),
            setLogoHeight: (logoHeight) => set({ logoHeight }),
            setLogoOpacity: (logoOpacity) => set({ logoOpacity }),
            setRemoveQrCodeBehindLogo: (removeQrCodeBehindLogo) => set({ removeQrCodeBehindLogo }),
            setLogoPadding: (logoPadding) => set({ logoPadding }),
            setLogoPaddingStyle: (logoPaddingStyle) => set({ logoPaddingStyle }),
            setQrStyle: (qrStyle) => set({ qrStyle }),
            setEyeRadius: (eyeRadius) => set({ eyeRadius }),
            setEyeColor: (eyeColor) => set({ eyeColor }),
            resetConfig: () => set({ ...defaultConfig }),
        }),
        {
            name: 'qr-config-storage',
        }
    )
);