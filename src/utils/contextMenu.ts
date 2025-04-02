import { browser, type Browser } from 'wxt/browser';

// 图标路径常量
const ICONS = {
    PAGE_URL: '/icon/page-url.png',
    SELECTION: '/icon/text-selection.png',
    LINK: '/icon/link.png',
    IMAGE: '/icon/image.png'
};

// 右键菜单ID
export enum ContextMenuId {
    PAGE_URL = 'generate_qr_for_page',
    SELECTION = 'generate_qr_for_selection',
    IMAGE = 'generate_qr_for_image',
    LINK = 'generate_qr_for_link',
}

// 创建右键菜单
export function createContextMenus() {
    // 移除所有现有菜单
    browser.contextMenus.removeAll().then(() => {
        // 为页面添加菜单
        browser.contextMenus.create({
            id: ContextMenuId.PAGE_URL,
            title: '生成当前页面二维码',
            contexts: ['page'],

        });

        // 为选中文本添加菜单
        browser.contextMenus.create({
            id: ContextMenuId.SELECTION,
            title: '为选中内容生成二维码',
            contexts: ['selection'],
        });

        // 为链接添加菜单
        browser.contextMenus.create({
            id: ContextMenuId.LINK,
            title: '为链接生成二维码',
            contexts: ['link'],
        });

        // 为图片添加菜单
        browser.contextMenus.create({
            id: ContextMenuId.IMAGE,
            title: '为图片链接生成二维码',
            contexts: ['image'],
        });

        console.log('创建菜单完成，菜单ID:', {
            PAGE_URL: ContextMenuId.PAGE_URL,
            SELECTION: ContextMenuId.SELECTION,
            LINK: ContextMenuId.LINK,
            IMAGE: ContextMenuId.IMAGE
        });
    });
}

// 处理右键菜单点击
export async function handleContextMenuClick(
    info: Browser.contextMenus.OnClickData,
    tab?: Browser.tabs.Tab
) {
    console.log('处理右键菜单点击:', info.menuItemId, info);

    if (!tab || !tab.id) {
        console.error('无有效标签页');
        return;
    }

    let content = '';
    let title = '二维码 | Quick QRCode';

    try {
        // 根据点击的菜单项获取内容
        switch (info.menuItemId) {
            case ContextMenuId.PAGE_URL:
                content = tab.url || '';
                title = '当前页面 | Quick QRCode';
                console.log('使用当前页面URL:', content);
                break;

            case ContextMenuId.SELECTION:
                // 获取选中的文本
                console.log('尝试获取选中文本');

                try {
                    const result = await browser.tabs.sendMessage(tab.id, {
                        type: 'getSelectedText',
                        from: 'contextMenu'
                    });

                    console.log('收到选中文本结果:', result);

                    content = result?.selectedText || '';
                    if (!content) {
                        console.warn('未能获取到选中文本，尝试使用info.selectionText');
                        content = info.selectionText || '';
                    }

                    title = '选中文本 | Quick QRCode';
                } catch (error) {
                    console.error('获取选中文本失败:', error);
                    // 备用方案: 直接从info中获取
                    content = info.selectionText || '';
                    console.log('使用info.selectionText:', content);
                }

                if (!content) {
                    throw new Error('未能获取选中文本');
                }

                break;

            case ContextMenuId.LINK:
                content = info.linkUrl || '';
                title = '链接 | Quick QRCode';
                console.log('使用链接URL:', content);
                break;

            case ContextMenuId.IMAGE:
                content = info.srcUrl || '';
                title = '图片链接 | Quick QRCode';
                console.log('使用图片URL:', content);
                break;

            default:
                console.error('未知的菜单ID:', info.menuItemId);
                return;
        }

        if (!content) {
            throw new Error('未能获取内容');
        }

        console.log('临时内容已保存:', content);

        // 存储临时数据
        await browser.storage.local.set({
            tempContent: content,
        });
        console.log('内容已存储到storage');

        // 创建新窗口打开扩展页面，而不是直接打开popup（因为openPopup在某些浏览器中不受支持）
        console.log('尝试打开扩展页面...');
        await browser.windows.create({
            url: browser.runtime.getURL('/popup.html'),
            type: 'popup',
            width: 800,
            height: 600
        });
        console.log('扩展页面已在新窗口中打开');
    } catch (error) {
        console.error('生成QR码失败:', error);
    }
}