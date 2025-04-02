import { browser } from 'wxt/browser';

// 避免在Node环境中使用window对象
const logPageInfo = () => {
  if (typeof window !== 'undefined' && window.location) {
    console.log('Quick QRCode content script loaded', { url: window.location.href });
  } else {
    console.log('Quick QRCode content script loaded (Node环境)');
  }
};

// 安全地调用日志函数
logPageInfo();

// 监听上下文菜单事件
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message, 'from', sender);

  if (message.type === 'getSelectedText') {
    const selectedText = typeof window !== 'undefined' ? (window.getSelection()?.toString() || '') : '';
    console.log('获取选中文本:', selectedText, '长度:', selectedText.length);

    // 使用回调函数方式返回
    sendResponse({ selectedText });

    // 同时支持Promise方式返回
    return Promise.resolve({ selectedText });
  }

  return false;
});

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    // 安全地调用日志函数
    logPageInfo();
    console.log('Quick QRCode content script 激活');

    // 不再自动监听选中文本事件，只通过右键菜单触发
  },
});
