import { Light } from "./light.implement";

const OK = "+OK\u0000";

export interface LightStatus {
  queryAllConfig(): void;
  queryChannelConfig(channel?: number): void;
  setChannelLightness(channel: number, lightness: number): void;
  setLightTrigger(channel: number, trigger: number): void;
  setLightDelay(channel: number, time: number): void;
  getSetupMsg(): string | null;
  getQueryMsg(): string | null;
  digestMsg(msg: string): void;
  openLight(channel: number, open: number): void;
}

// 设置中状态
export class SettingUpStatus implements LightStatus {
  constructor(private light: Light) {}
  openLight(channel: number, open: number): void {}
  setLightDelay(channel: number, time: number): void {}
  setLightTrigger(channel: number, trigger: number): void {}

  digestMsg(msg: string) {
    if (msg === OK) {
      this.light.setStatus(new SetupCompletedStatus(this.light, msg));
    } else if (msg.startsWith("E")) {
      this.light.setStatus(new ErrorStatus(this.light, msg));
    }
  }
  getSetupMsg(): string | null {
    return null;
  }
  getQueryMsg(): string | null {
    return null;
  }
  queryAllConfig(): void {}
  queryChannelConfig(channel: number): void {}
  setChannelLightness(channel: number, lightness: number): void {}
  toString(): string {
    return "设置中状态";
  }
}

// 设置完成
export class SetupCompletedStatus implements LightStatus {
  constructor(private light: Light, private setupMsg: string) {}
  openLight(channel: number, open: number): void {}
  setLightDelay(channel: number, time: number): void {}
  setLightTrigger(channel: number, trigger: number): void {}

  digestMsg(msg: string) {}
  getQueryMsg(): string {
    throw null;
  }
  setSetupMsg(msg: string) {
    this.setupMsg = msg;
  }
  getSetupMsg() {
    this.light.setStatus(new IdleStatus(this.light));
    return this.setupMsg;
  }
  queryChannelConfig(channel: number): void {}
  queryAllConfig(): void {}
  setChannelLightness(channel: number, lightness: number): void {}
  toString(): string {
    return "设置完成状态";
  }
}

// 查询中状态
export class QueryingStatus implements LightStatus {
  constructor(private light: Light) {}
  openLight(channel: number, open: number): void {}
  setLightDelay(channel: number, time: number): void {}
  setLightTrigger(channel: number, trigger: number): void {}

  digestMsg(msg: string) {
    if (msg.startsWith("E")) {
      this.light.setStatus(new ErrorStatus(this.light, msg));
    } else if (msg !== OK) {
      this.light.setStatus(new QueryCompletedStatus(this.light, msg));
    }
  }
  getSetupMsg(): string | null {
    return null;
  }
  getQueryMsg(): string | null {
    return null;
  }
  queryChannelConfig(channel: number): void {}
  queryAllConfig(): void {}
  setChannelLightness(channel: number, lightness: number): void {}
  toString(): string {
    return "查询中状态";
  }
}

// 查询完成状态
export class QueryCompletedStatus implements LightStatus {
  constructor(private light: Light, private queryMsg: string) {}
  openLight(channel: number, open: number): void {}
  setLightDelay(channel: number, time: number): void {}
  setLightTrigger(channel: number, trigger: number): void {}

  digestMsg(msg: string) {}
  getSetupMsg(): string | null {
    return null;
  }
  setQueryMsg(msg: string) {
    this.queryMsg = msg;
  }
  getQueryMsg() {
    this.light.setStatus(new IdleStatus(this.light));
    return this.queryMsg;
  }
  queryChannelConfig(channel: number): void {}
  queryAllConfig(): void {}
  setChannelLightness(channel: number, lightness: number): void {}
  toString(): string {
    return "查询完成状态";
  }
}

// 空闲状态
export class IdleStatus implements LightStatus {
  constructor(private light: Light) {}
  openLight(channel: number, open: number): void {
    this.light._openLight(channel, open);
    this.light.setStatus(new SettingUpStatus(this.light));
  }

  digestMsg(msg: string) {}
  getSetupMsg(): string | null {
    return null;
  }
  getQueryMsg(): string | null {
    return null;
  }
  queryChannelConfig(channel: number): void {
    this.light._queryChannelConfig(channel);
    this.light.setStatus(new QueryingStatus(this.light));
  }
  queryAllConfig(): void {
    this.light._queryAllConfig();
    this.light.setStatus(new QueryingStatus(this.light));
  }
  setChannelLightness(channel: number, lightness: number): void {
    this.light._setChannelLightness(channel, lightness);
    this.light.setStatus(new SettingUpStatus(this.light));
  }
  setLightTrigger(channel: number, trigger: number): void {
    this.light._setLightTrigger(channel, trigger);
    this.light.setStatus(new SettingUpStatus(this.light));
  }
  setLightDelay(channel: number, time: number): void {
    this.light._setLightDelay(channel, time);
    this.light.setStatus(new SettingUpStatus(this.light));
  }
  toString(): string {
    return "空闲状态";
  }
}

// 超时状态
export class TimeoutStatus implements LightStatus {
  constructor(private light: Light) {}
  openLight(channel: number, open: number): void {
    throw new Error("超时状态");
  }
  setLightDelay(channel: number, time: number): void {
    throw new Error("超时状态");
  }
  setLightTrigger(channel: number, trigger: number): void {
    throw new Error("超时状态");
  }
  queryAllConfig(): void {}
  digestMsg(msg: string) {
    this.light.setStatus(new ErrorStatus(this.light, msg));
  }
  queryChannelConfig(channel?: number): void {}
  setChannelLightness(channel: number, lightness: number): void {}
  getSetupMsg(): string | null {
    return null;
  }
  getQueryMsg(): string | null {
    return null;
  }
  toString(): string {
    return "超时状态";
  }
}

// 错误状态
export class ErrorStatus implements LightStatus {
  constructor(private light: Light, msg: string) {}
  openLight(channel: number, open: number): void {
    throw new Error("错误状态");
  }
  setLightDelay(channel: number, time: number): void {
    throw new Error("错误状态");
  }
  setLightTrigger(channel: number, trigger: number): void {
    throw new Error("错误状态");
  }
  queryAllConfig(): void {}
  digestMsg(msg: string) {}
  getSetupMsg(): string {
    throw new Error("错误状态");
  }
  getQueryMsg(): string {
    throw new Error("错误状态");
  }
  queryChannelConfig(channel: number): void {}
  setChannelLightness(channel: number, lightness: number): void {}
  toString(): string {
    return "错误状态";
  }
}
