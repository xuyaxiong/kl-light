import { Light, LightConfig } from "./light.implement";
import { LightStatus } from "./light.status";
import { LightPropDTO } from "./light.dto";

export class LightUtil {
  private lightConfigList: LightConfig[];
  private lightList: Light[] = [];

  constructor(lightConfigList: LightConfig[]) {
 
    this.lightConfigList = lightConfigList;
    this.initAll();
  }

  private async initAll() {
    this.lightList = [];
    for (const lightConfig of this.lightConfigList) {
      const light = new Light(lightConfig);
      light.init();
      this.lightList.push(light);
    }
  }

  public async getLightList(): Promise<LightPropDTO[]> {
    const configList = [];
    for (let light of this.lightList) {
      let config = await light.queryChannelConfig(light.channel);
      const lightPropDTO = {
        ...light.lightConfig,
        ...config,
      } as LightPropDTO;
      configList.push(lightPropDTO);
    }
    return configList;
  }

  // 打开/关闭光源
  public async openLight(lightIdx: number, channel: number, open: number) {
    return this.lightList[lightIdx].openLight(channel, open);
  }

  // 设置亮度
  public async setLightness(
    lightIdx: number,
    channel: number,
    lightness: number
  ) {
    return this.lightList[lightIdx].setLightness(channel, lightness);
  }

  // 设置触发方式
  public async setLightTrigger(
    lightIdx: number,
    channel: number,
    trigger: number
  ) {
    return this.lightList[lightIdx].setLightTrigger(channel, trigger);
  }

  // 设置发光时间
  public async setLightDelay(lightIdx: number, channel: number, time: number) {
    return this.lightList[lightIdx].setLightDelay(channel, time);
  }

  // 查询某光源所有配置
  public async queryAllConfig(lightIdx: number) {
    return await this.lightList[lightIdx].queryAllConfig();
  }

  // 查询某光源指定通道配置
  public async queryChannelConfig(lightIdx: number, channel: number) {
    return await this.lightList[lightIdx].queryChannelConfig(channel);
  }

  // 查询状态
  public getLightStatus(lightIdx: number): LightStatus {
    return this.lightList[lightIdx].status;
  }

  public getIdxAndChannelById(id: number) {
    for (let [idx, light] of this.lightList.entries()) {
      if (light.id === id) {
        return { idx, channel: light.channel };
      }
    }
    throw new Error("光源不存在");
  }
}
