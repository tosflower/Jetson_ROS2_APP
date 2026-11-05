// 在网页入口执行前监听错误；提示由原生页面展示，网页启动失败时也能读取。
// 非空的 before-content 脚本还会触发 Android RNCWebView 重新注入初始 props。
export const AMAP_WEBVIEW_DIAGNOSTICS = `
(function () {
  if (window.__amapDiagnosticsInstalled) return;
  window.__amapDiagnosticsInstalled = true;
  function report(message) {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'amap-page-error', data: String(message).slice(0, 300)
      }));
    }
  }
  window.addEventListener('error', function (event) {
    // 资源加载失败交给地图加载器处理，仅上报 JavaScript 执行异常。
    if (event.message) report(event.message);
  });
  window.addEventListener('unhandledrejection', function (event) {
    report(event.reason && event.reason.message || event.reason || '未处理的网页错误');
  });
})();
true;
`;
