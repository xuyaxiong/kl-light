import * as dgram from "node:dgram";
import { LightStatus, IdleStatus, TimeoutStatus } from "./light.status";
import { LTF, LightConfig } from "./light.dto";
import Tools from "./light.tools";
import { MSG_HEART_BEAT_STR } from "./constant";
import LightIns from "./light.ins";

export class Light {
  static TIMEOUT = 300; // 通信超时时间
  public readonly lightConfig: LightConfig;
  public readonly id: number;
  public readonly name: string;
  public readonly ip: string;
  public readonly port: number;
  public readonly mask: string;
  public readonly channel: number;
  private client!: dgram.Socket;
  public status!: LightStatus;

  constructor(lightConfig: LightConfig) {
    this.lightConfig = lightConfig;
    this.ip = lightConfig.ip;
    this.port = lightConfig.port;
    this.channel = lightConfig.channel;
    this.name = lightConfig.name;
    this.mask = lightConfig.mask;
    this.id = lightConfig.id;
    this.init();
  }

  public setStatus(status: LightStatus) {
    this.status = status;
  }

  // 初始化
  private init() {
    // 创建udp服务
    this.createUdpServer();
    this.status = new IdleStatus(this);
  }

  // 查询所有配置
  public async queryAllConfig() {
    return await this.operateWrapper(
      () => {
        this.status.queryAllConfig();
      },
      (res: string) => {
        return Tools.parseAllConfig(res);
      }
    )(null, null);
  }

  // 查询某通道配置
  public async queryChannelConfig(channel: number): Promise<LTF | null> {
    return await this.operateWrapper(
      () => {
        this.status.queryChannelConfig(channel);
      },
      (res: string) => {
        return Tools.parseChannelConfig(res);
      }
    )(channel, null);
  }

  // 打开/关闭光源
  public async openLight(channel: number, open: number) {
    await this.operateWrapper(() => {
      this.status.openLight(channel, open);
    })(channel, open);
  }

  // 设置亮度
  public async setLightness(channel: number, lightness: number) {
    await this.operateWrapper(() => {
      this.status.setChannelLightness(channel, lightness);
    })(channel, lightness);
  }

  // 设置触发方式
  public async setLightTrigger(channel: number, trigger: number) {
    await this.operateWrapper(() => {
      this.status.setLightTrigger(channel, trigger);
    })(channel, trigger);
  }

  // 设置发光时间
  public async setLightDelay(channel: number, time: number) {
    await this.operateWrapper(() => {
      this.status.setLightDelay(channel, time);
    })(channel, time);
  }

  private operateWrapper(operate: Function, dealRes?: Function) {
    return async (param1: number | null, param2: number | null) => {
      try {
        operate(param1, param2);
        await this.sleep();
        const res = this.status.getSetupMsg();
        if (!res) {
          this.setStatus(new TimeoutStatus(this));
        } else {
          if (dealRes) {
            return dealRes(res);
          }
        }
      } catch (error: any) {
        console.log(error.message);
        return null;
      }
    };
  }

  // 关闭服务
  public close() {
    this.client.close();
  }

  // 监听消息
  private onMessage(msg: string, address: string) {
    if (msg === MSG_HEART_BEAT_STR) {
      // console.log('Udp heartbeat');
    } else {
      console.log(
        `light controller: receive address = ${address}, msg = ${msg}`
      );
      this.status.digestMsg(msg);
    }
  }

  _queryAllConfig() {
    this.send(LightIns.getQueryAllConfigIns());
  }

  _queryChannelConfig(channel: number) {
    this.send(LightIns.getQueryChannelConfigIns(channel));
  }

  _setChannelLightness(channel: number, lightness: number) {
    this.send(LightIns.getSetChannelLightnessIns(channel, lightness));
  }

  _setLightTrigger(channel: number, trigger: number) {
    this.send(LightIns.getSetLightTriggerIns(channel, trigger));
  }

  _setLightDelay(channel: number, time: number) {
    this.send(LightIns.getSetLightDelayIns(channel, time));
  }

  _openLight(channel: number, open: number) {
    this.send(LightIns.getOpenLightIns(channel, open));
  }

  // 创建UDP服务
  private createUdpServer() {
    (async () => {
      this.client = dgram.createSocket("udp4");
      this.client.on("message", (msg, { address }) => {
        this.onMessage(msg.toString(), address);
      });
    })();
  }

  // 发送指令
  private send(strToSend: string) {
    return new Promise(async (resolve, reject) => {
      if (null != this.client) {
        console.log(`light controller: send ${strToSend} to ${this.ip}`);
        this.client.send(strToSend, this.port, this.ip, (err, data) => {
          if (err) reject(false);
          else resolve(true);
        });
      }
    });
  }

  private sleep(timeout: number = Light.TIMEOUT) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
}
