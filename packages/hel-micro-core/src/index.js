/** @typedef {import('../index').IPlatformConfig} IPlatformConfig */
/** @typedef {import('../index').IPlatformConfigFull} IPlatformConfigFull */
/** @typedef {import('../index').SharedCache} SharedCache */
import * as commonUtilMod from './base/commonUtil';
import * as globalRef from './base/globalRef';
import * as debugMod from './base/microDebug';
import { ensureHelMicroShared } from './base/microShared';
import * as util from './base/util';
import * as consts from './consts';
import * as app from './data/app';
import * as conf from './data/conf';
import * as event from './data/event';
import * as lib from './data/lib';
import * as meta from './data/meta';
import * as status from './data/status';
import * as style from './data/style';
import * as version from './data/version';
import * as guess from './handle/guess';
import * as iso from './handle/iso';
import * as ready from './handle/ready';
import * as cacheWrap from './wrap/cache';

util.log(`hel-micro-core ver ${consts.VER}`);

const { DEFAULT_API_PREFIX, DEFAULT_API_URL, DEFAULT_PLAT, DEFAULT_USER_LS_KEY, PLAT_UNPKG, PLAT_HEL } = consts;

export const helConsts = {
  DEFAULT_API_PREFIX,
  DEFAULT_API_URL,
  DEFAULT_PLAT,
  DEFAULT_USER_LS_KEY,
  PLAT_UNPKG,
  PLAT_HEL,
};

export const commonUtil = commonUtilMod;

export const { isSubApp, trySetMasterAppLoadedSignal } = iso;

export function resetGlobalThis(globalThis) {
  if (globalThis) {
    setGlobalThis(globalThis);
  }
  // 载入此包就尝试设置 masterApp 锁，以推断自己是不是父应用
  iso.trySetMasterAppLoadedSignal(!!globalThis);
  // 确保 __HEL_MICRO_SHARED__ 存在
  ensureHelMicroShared();
}

resetGlobalThis();

/**
 * 获取默认的平台值
 * @returns
 */
export const { getPlatform, getSharedCache } = cacheWrap;

export const helEvents = consts.HEL_EVENTS;

export const helLoadStatus = consts.HEL_LOAD_STATUS;

export const { allowLog, log } = util;

export const getHelDebug = debugMod.getHelMicroDebug;

export const { getGlobalThis, setGlobalThis } = globalRef;

// 应用Comp get set
export const { getVerApp, setEmitApp } = app;

// 应用lib get set
export const { getVerLib, setEmitLib } = lib;

// 应用元数据 get set
export const { getAppMeta, setAppMeta } = meta;

// 版本数据 get set
export const { getVersion, setVersion } = version;

// 版本获取状态 get set，样式字符串获取状态 get set
export const { getVerLoadStatus, setVerLoadStatus, getVerStyleStrStatus, setVerStyleStrStatus } = status;

// 构建生成样式字符串 get set，sdk注入的额外样式列表 get set
export const { getAppStyleStr, setAppStyleStr, getVerExtraCssList, setVerExtraCssList } = style;

export const { tryGetVersion, tryGetAppName } = guess;

export const { getPlatformConfig, getAppPlatform, setAppPlatform, initPlatformConfig, originInit } = conf;

export const { getHelEventBus, getUserEventBus } = event;

export const { libReady, appReady } = ready;
