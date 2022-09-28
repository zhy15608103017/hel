import type { Platform } from 'hel-types';

export type LibName = string;

export type LibProperties = Record<string, any>;
/**
 * let statement in user's types/libIndex file below work:
 * export const lib: LibMap<'someLib', LibPropertyType> = libProxy;
 */
export type LibMap<Name extends LibName = LibName, Properties extends LibProperties = LibProperties> = { [K in Name]: Properties };

export interface IOptions {
  /**
   * default: false
   * 允许重复注册
   */
  allowDup?: boolean;
  platform?: Platform;
}

export interface IExposeLibOptions {
  platform?: Platform;
  /** default：true，是否以 proxy 对象暴露出去，仅当浏览器支持 Proxy 时该设置有效 */
  asProxy?: boolean;
}
