import type { IPreFetchOptionsBase } from 'hel-micro';
import type { ISubAppVersion, Platform } from 'hel-types';
import React from 'react';

// react-dom <= 16.9.10 并无此类型，取 ReactDOM.Container 会报红警告，这里单独声明一下
export type Container = Element | Document | DocumentFragment;

export type AnyRecord = Record<string, any>;

export type AnyComp = React.FC<any> | React.ComponentClass<any>;

export type AnyCompOrNull = AnyComp | null | undefined;

export type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

export type Len2StrArr = [string, string];

export type GetSubVal = <T extends any = any>(subCompName: string, waitVal?: any) => T;

export type GetSubVals = <T extends AnyRecord = AnyRecord>(subCompNames: string[], waitVal?: any) => T;

/**
 * 默认：false
 *
 * 为 true 时，表示使用历史的透传 props 方式
 * 为了让老版本 hel-micro-react 载入远程组件不报错，保持数据形如 { helContext, children, appProps } 透传给远程组件
 *
 * 为 false 时，表示使用最新的透传 props 方式
 * 最新模式透传给远程组件的 props 形如 { helContext, children, ...otherUserDefineProps }
 * 即将用户组件上定义的所有属性原封不动传给远程组件，并额外注入一个 helContext 属性
 */
export type IsLegacy = boolean;

/**
 * 用户调用 MicroApp 需要传递的类型描述
 */
export interface IUseRemoteCompOptions extends IPreFetchOptionsBase {
  /** 如果指定了 Component，表示复用 name 对应的预设应用样式，但使用用户透传的组件渲染 */
  Component?: AnyCompOrNull;
  /**
   * 处理默认解析出来的字符串，返回的新字符串会替代掉默认字符串
   * 如果设置了此函数，应用自定自带的解析出来的样式字符串无效
   * 通常用于配置本地调试 Component 时之用，作用于 Component 组件处于本地调试的 shadow 渲染时，设置样式字符串
   * 如 ()=>{ let styleStr = ''; document.querySelectorAll('style').forEach(item=>{styleStr+=item.innerText;}); return styleStr }
   * 如  document.querySelectorAll('style')[0].innerText
   * 或者组件使用方处于某种目的，想强制重新设置样式字符串
   */
  handleStyleStr?: (mayFetchedStr: string) => string;
  /**
   * default: true
   * 远程组件默认是 memo 起来的，设置为 false 关闭 memo 功能
   */
  needMemo?: boolean;
  onStyleFetched?: (params: { mayHandledStyleStr: string; oriStyleStr: string; styleUrlList: string[] }) => void;
  /**
   * 异步加载组件过程的过度组件
   */
  Skeleton?: AnyCompOrNull;
  /**
   * default: ()=> <h1>HelMicroComp error {errMsg}</h1>
   * 渲染出现错误时的 Error 组件
   */
  Error?: (props: { errMsg: string }) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
  onAppVersionFetched?: (appVersion: ISubAppVersion) => void;
  failCb?: (err: Error) => void;
  /**
   * default: true
   */
  shadow?: boolean;
  /**
   * default: undefined，该属性仅在 shadow 为 true 时有意义
   * 表示包裹shadowRoot节点的div节点的额外样式
   */
  shadowWrapStyle?: React.CSSProperties;
  /**
   * default: undefined，该属性仅在 shadow 为 true 时有意义
   * 表示构建 shadow-dom 的延迟时间
   */
  shadowDelay?: number;
  /**
   * default: false [when shadow is true], true [when shadow is false]
   * 未显式设置 appendCss 时，它的默认受设置 shadow 影响，大多数时候应该走此规则，不需要人为设置
   * 表示是否向 document 上附加样式外联样式标签
   */
  appendCss?: boolean;
  /**
   * default: true，该属性仅在 shadow 为 true 时有意义
   * 是否把 IPreFetchOptionsBase.extraCssList 和应用自身的构建产物里的样式列表转为字符串后再注入到 shadowdom 里
   * 默认 true 值，避免 shadowdom 组件渲染时出现抖动情况
   */
  cssListToStr?: boolean;
  /**
   * default: []，该属性仅在 shadow 为 true 时有意义
   * 以 shadowdom 模式渲染时，额外追加到 shadowdom 里的样式列表，通常作用于
   * 1 目标组件以shadow模式渲染，让用户有机会自己注入额外的样式
   * 2 目标组件以shadow模式渲染，想覆盖组件的已有样式
   */
  extraShadowCssList?: string[];
  /**
   * default: true，该属性仅在 shadow 为 true 时有意义
   * 是否把 extraShadowCssList 里的样式转为字符串后再注入到 shadowdom 里
   * 默认 true 值，避免 shadowdom 组件渲染时出现抖动情况
   */
  extraShadowCssListToStr?: boolean;
  /**
   * default: undefined，该属性仅在 shadow 为 true 时有意义
   * 额外注入到shadowdom 里的样式字符串
   */
  extraShadowStyleStr?: string;
  /**
   * 在shadow模式下，默认使用 ReactDOM.render 挂载 shadowBody 到 body 下,
   * 18版本react推荐使用 react-dom/client.createRoot 方法替代 ReactDOM.render
   * 但程序内部无法写为如下格式来动态判断是否使用 createRoot 方法
   * ```ts
   *   if (ReactDOM.createRoot) {
   *      // 16 版本react时，webpack编译到此处就报错 webpackMissingModule
   *      const domClient = await import('react-dom/client');
   *      const root = domClient.createRoot(mountNode);
   *      root.render(uiShadowView);
   *   } else {
   *      ReactDOM.render(uiShadowView, mountNode);
   *   }
   * ```
   * 如果如果用户在18版本 react 下调用 useRemoteComp 方法并使用了shadow模式，为避免 react-dom/client.createRoot 警告
   * 需人工把 createRoot 传递下来
   */
  createRoot?: (...args: any) => any;
  /**
   * default: false
   * shadow 模式渲染时，是否为为当前实例挂载一个 shadowBody 容器到 document 下，
   * 通常用于组件内部的 Picker Select Modal Drawer 等组件设置 getContainer 时用，
   * 以便让这些组件也安全的渲染到样式隔离的shadowBody 容器里，
   * 为性能考虑，默认是false，让用户优先考虑设置 staticShadowBody
   */
  mountShadowBodyForRef?: boolean;
  /**
   * default: false
   * 是否需要忽略把 helContext 透传给远程组件，
   * 默认不忽略，总是透传 helContext 给远程组件
   * 如需要忽略，可设置此项为 true
   */
  ignoreHelContext?: boolean;
  /**
   * 自定义的 shadowdom 渲染器，替换内置的渲染器
   * @param props
   * @returns
   */
  ShadowViewImpl?: ShadowViewImplComp;
}

/**
 * 用户调用 MicroApp 需要传递的类型描述
 */
export interface IMicroAppProps<T extends AnyRecord = AnyRecord> extends IUseRemoteCompOptions {
  /**
   * 应用名
   */
  name: string;
  /** 透传给目标应用的属性集 */
  compProps?: T;
  children?: any;
}

export interface IInnerRemoteModuleProps<T extends AnyRecord = AnyRecord> extends IMicroAppProps<T> {
  /**
   * default: false
   */
  isLegacy?: IsLegacy;
  /**
   * default: false
   */
  isLib?: boolean;
  /**
   * 使用 libReady 弹出的组件集合里，具体的组件名
   */
  compName?: string;
  reactRef?: any;
}

type IMicroAppLegacyPropsBase<T extends AnyRecord = AnyRecord> = Omit<IMicroAppProps<T>, 'versionId' | 'enableDiskCache'>;

/**
 * MicroAppLegacy 组件的历史遗留属性，后面的新组件和新接口为了统一词汇，
 * 一律都复用 IPreFetchOptionsBase 里的命名
 */
export interface IMicroAppLegacyProps<T extends AnyRecord = AnyRecord> extends IMicroAppLegacyPropsBase<T> {
  version?: string;
  cache?: boolean;
  appProps?: T;
}

export interface ILocalCompProps {
  /** 要渲染的目标组件 */
  Comp?: AnyCompOrNull;
  /** 目标组件的属性 */
  compProps?: AnyRecord;
  /** 目标组件的样式列表 */
  cssList?: string[];
  /**
   * default: true
   * 是否将 cssList 转为 string，可避免初次加载样式抖动问题
   */
  cssListToStr?: boolean;
  /**
   * 额外的样式字符串
   */
  extraShadowStyleStr?: string;
  /**
   * default: 'LocalComp'
   * shadow节点宿主 web-component id
   */
  name?: string;
  /** 骨架屏组件 */
  Skeleton?: any;
  /** 加载出错是的组件 */
  Error?: any;
  /** 目标组件的孩子节点  */
  children?: any;
  reactRef?: React.Ref<any>;
  /**
   * default: true
   */
  shadow?: boolean;
  /** 包裹shadowRoot节点的div节点的额外样式 */
  shadowWrapStyle?: React.CSSProperties;
  /** 构建 shadow-dom的延迟时间 */
  shadowDelay?: number;
}

export interface IUseRemoteLibCompOptions extends IPreFetchOptionsBase {
  /**
   * 异步加载组件过程的过度组件
   */
  Skeleton?: AnyCompOrNull;
  /**
   * default: ()=> <h1>HelMicroComp error {errMsg}</h1>
   * 渲染出现错误时的 Error 组件
   */
  Error?: (props: { errMsg: string }) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
  onStyleFetched?: (params: { mayHandledStyleStr: string; oriStyleStr: string; styleUrlList: string[] }) => void;
  handleStyleStr?: (mayFetchedStr: string) => string;
  /** 组件获取到后，延迟返回的时间，单位：ms */
  delay?: number;
}

export interface IInnerUseRemoteCompOptions extends IUseRemoteCompOptions {
  isLegacy?: IsLegacy;
}

export interface IRenderAppOptions {
  App: AnyComp;
  appGroupName: string;
  hostNodeId?: string;
  /** 是否自渲染，大多数情况下不需要传入，让子应用自己通过内部维护的 signal 去做判断 */
  renderSelf?: boolean;
  /**
   * 当 renderSelf 为 true 时，如果用户传递了定制的 renderSelfFn 函数（例如react18的新渲染方式），
   * 则会执行此函数，否则默认按 ReactDom.render 来执行自渲染
   */
  renderSelfFn?: (App: AnyComp, hostNode: Container) => void;
  /** 也可以透传 createRoot 句柄，来支持18 版本react的渲染 */
  createRoot?: (...args: any[]) => any;
  lifecycle?: {
    mount: () => void;
    unmount: () => void;
  };
  /**
   * default：'unpkg'
   */
  platform?: Platform;
}

export interface IHelContext {
  platform: string;
  name: string;
  versionId: string;
  /**
   * shadow 模式下组件自身挂载的 shadow-dom 节点
   */
  getShadowAppRoot: () => React.ReactHTMLElement<any> | null;
  /**
   * 当做远程组件内部的 Select Picker Modal 等组件设置 Container 时，
   * 可以调用 getShadowBodyRoot 来设置挂载节点，以确保它们也能够渲染到 shadow-dom 里，从而保证样式隔离
   * 注意：非shadow 模式渲染，获取不到 shadow root 的
   * shadowBody的生成规则，受 @see {IMicroAppProps['mountShadowBodyForRef']} 影响
   */
  getShadowBodyRoot: () => React.ReactHTMLElement<any> | null;
  /**
   * 同 getShadowBodyRoot 作用一样，不同是 staticShadowBody 它只会生成一个，shadowBody 会为每一个组件都单独生成一个
   */
  getStaticShadowBodyRoot: () => React.ReactHTMLElement<any> | null;
  /**
   * 优先取 getShadowBodyRoot，再取 getStaticShadowBodyRoot，最后取 document.body
   */
  getEnsuredBodyRoot: () => React.ReactHTMLElement<any> | null;
}

/**
 * 被远程加载的组件可以使用该类型来包裹 props
 * 因用户可能设置 ignoreHelContext 为 true，所以此处 helContext 是 ?
 */
export type IHelProps<ReactProps> = ReactProps & { helContext?: IHelContext };

export interface IShadowViewImplProps {
  onShadowRootReady: (shadowRoot: ShadowRoot) => void;
  /**
   * 根元素的 tagName，默认为 'hel-shadow-view'
   */
  tagName?: string;
  /**
   * shadow host 元素的样式
   */
  style?: React.CSSProperties;
  /**
   * default: '.3s', 显示动画持续时间，如果 style 里也设置了，会覆盖这里
   */
  transitionDuration?: string;
  /**
   * 样式字符串内容
   */
  styleContent?: string;
  /**
   * 样式 url 列表
   */
  styleSheets?: string[];
  /**
   * 显示延时
   */
  shadowDelay?: number;
  /**
   * default: true
   */
  delegatesFocus?: boolean;
  children?: any;
  /**
   * React Ref function
   */
  ref?: Function;
  /**
   * default: ''
   */
  data?: string;
}

/**
 * 实现的 react 组件内部，一定要调用 props.onShadowRootReady 方法把 shadowRoot 引用传出去
 * 示例可参考 @see https://github.com/tnfe/hel/blob/main/packages/hel-micro-react/src/components/ShadowViewV2.tsx
 * 如不调用此方法会导致 useRemoteComp 一直处于骨架屏状态
 */
export type ShadowViewImplComp = (props: IShadowViewImplProps) => React.ReactNode;
