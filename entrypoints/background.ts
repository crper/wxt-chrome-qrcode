import { createContextMenus, handleContextMenuClick } from '../src/utils/contextMenu';

export default defineBackground(() => {
  console.log('Quick QRCode background script initialized', { id: browser.runtime.id });

  try {
    // 创建右键菜单
    createContextMenus();
    console.log('右键菜单创建成功');

    // 监听右键菜单点击事件
    browser.contextMenus.onClicked.addListener((info, tab) => {
      console.log('右键菜单点击事件:', info.menuItemId, info, tab);
      handleContextMenuClick(info, tab);
    });

    // 监听来自content脚本的消息 - 现在只处理特定的消息类型
    browser.runtime.onMessage.addListener((message, sender) => {
      console.log('收到content脚本消息:', message, 'from', sender);
      return false; // 不需要异步响应
    });

    console.log('右键菜单点击监听器和消息监听器注册成功');
  } catch (error) {
    console.error('背景脚本初始化失败:', error);
  }
});
