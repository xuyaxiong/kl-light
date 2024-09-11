import * as dgram from "node:dgram";
import { LightStatus, IdleStatus, TimeoutStatus } from "./light.status";
import { LTF, LightConfig } from "./light.dto";
import Tools from "./light.tools";
import { HEART_BEAT_STR } from "./constant";

export class Light {
  static TIMEOUT = 300; // 通信超时时间
  lightConfig: LightConfig;
  ip: string;
  port: number;
  channel: number;
  mask: string;
  name: string;
  id: number;
  client!: dgram.Socket;
  status!: LightStatus;

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
  async init() {
    // 创建udp服务
    this.createUdpServer();
    this.status = new IdleStatus(this);
    await this.sleep();
  }

  // 查询所有配置
  async queryAllConfig() {
    try {
      this.status.queryAllConfig();
      await this.sleep();
      const resStr = this.status.getQueryMsg();
      if (resStr) return Tools.parseAllConfig(resStr);
      else {
        this.setStatus(new TimeoutStatus(this));
        return null;
      }
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  // 查询某通道配置
  async queryChannelConfig(channel: number): Promise<LTF | null> {
    try {
      this.status.queryChannelConfig(channel);
      await this.sleep();
      const resStr = this.status.getQueryMsg();
      if (resStr) return Tools.parseChannelConfig(resStr);
      else {
        this.setStatus(new TimeoutStatus(this));
        return null;
      }
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  // 打开/关闭光源
  async openLight(channel: number, open: number) {
    try {
      this.status.openLight(channel, open);
      await this.sleep();
      const res = this.status.getSetupMsg();
      if (!res) {
        this.setStatus(new TimeoutStatus(this));
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  // 设置亮度
  async setLightness(channel: number, lightness: number) {
    try {
      this.status.setChannelLightness(channel, lightness);
      await this.sleep();
      const res = this.status.getSetupMsg();
      if (!res) {
        this.setStatus(new TimeoutStatus(this));
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  // 设置触发方式
  async setLightTrigger(channel: number, trigger: number) {
    try {
      this.status.setLightTrigger(channel, trigger);
      await this.sleep();
      const res = this.status.getSetupMsg();
      if (!res) {
        this.setStatus(new TimeoutStatus(this));
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  // 设置发光时间
  async setLightDelay(channel: number, time: number) {
    try {
      this.status.setLightDelay(channel, time);
      await this.sleep();
      const res = this.status.getSetupMsg();
      if (!res) {
        this.setStatus(new TimeoutStatus(this));
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  // 关闭服务
  close() {
    this.client.close();
  }

  // 监听消息
  onMessage(msg: string, address: string) {
    if (msg === HEART_BEAT_STR) {
      // console.log('Udp heartbeat');
    } else {
      console.log(
        `light controller: receive address = ${address}, msg = ${msg}`
      );
      this.status.digestMsg(msg);
    }
  }

  _queryAllConfig() {
    this.send(0, `RD=9999`);
  }

  _queryChannelConfig(channel: number) {
    this.send(0, `RD=${channel}`);
  }

  _setChannelLightness(channel: number, lightness: number) {
    this.send(0, `L${channel}=${lightness}`);
  }

  _setLightTrigger(channel: number, trigger: number) {
    this.send(channel, `TR=${trigger}`);
  }

  _setLightDelay(channel: number, time: number) {
    this.send(0, `T${channel}=${time}`);
  }

  _openLight(channel: number, open: number) {
    this.send(0, `F${channel}=${open}`);
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
  private send(channel: number, action: string) {
    return new Promise(async (resolve, reject) => {
      if (null != this.client) {
        const ch = `00${Number(channel).toString()}`;
        console.log(
          `light controller: send $ID=${ch},${action}# to ${this.ip}`
        );
        this.client.send(
          `$ID=${ch},${action}#`,
          this.port,
          this.ip,
          (err, data) => {
            if (err) reject(false);
            else resolve(true);
          }
        );
      }
    });
  }

  private sleep(timeout: number = Light.TIMEOUT) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
}
