import { setSubMapValue } from '../base/util';
import { DEFAULT_ONLINE_VER, HEL_LOAD_STATUS } from '../consts';
import { getSharedCache } from '../wrap/cache';

const innerUtil = {
  getAppMeta(appName, platform) {
    const { appName2app } = getSharedCache(platform);
    return appName2app[appName];
  },

  setVerLoadStatus(appName, loadStatus, statusMapKey, options) {
    const { versionId, platform } = options || {};
    const appVerLoadStatus = getSharedCache(platform)[statusMapKey];
    const versionIdVar = versionId || DEFAULT_ONLINE_VER;
    setSubMapValue(appVerLoadStatus, appName, versionIdVar, loadStatus);
  },

  getVerLoadStatus(appName, statusMapKey, options) {
    const { versionId, platform } = options || {};
    const appVerLoadStatus = getSharedCache(platform)[statusMapKey];
    const versionIdVar = versionId || DEFAULT_ONLINE_VER;
    return appVerLoadStatus[appName]?.[versionIdVar] || HEL_LOAD_STATUS.NOT_LOAD;
  },

  // 预防一些未升级的老模块未写 DEFAULT_ONLINE_VER 的值到 libOrAppMap 里
  ensureOnlineModule(libOrAppMap, appName, platform) {
    if (libOrAppMap[DEFAULT_ONLINE_VER]) {
      return;
    }
    const appMeta = innerUtil.getAppMeta(appName, platform);
    const onlineModule = libOrAppMap[appMeta?.online_version];
    if (onlineModule) {
      libOrAppMap[DEFAULT_ONLINE_VER] = onlineModule;
    }
  },
};

export default innerUtil;
