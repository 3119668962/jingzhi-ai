const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('jingzhi', {
  isDesktop: true,
  loadState: () => ipcRenderer.invoke('state:load'),
  saveState: (state) => ipcRenderer.invoke('state:save', state),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (payload) => ipcRenderer.invoke('settings:save', payload),
  verifyWebsites: (items) => ipcRenderer.invoke('network:verify', items),
  webSearch: (query) => ipcRenderer.invoke('network:search', query),
  enhanceRecommendations: (payload) => ipcRenderer.invoke('ai:enhance', payload),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
  openDataFolder: () => ipcRenderer.invoke('app:openDataFolder'),
  getAppInfo: () => ipcRenderer.invoke('app:getInfo'),
});
