import { Light } from "./light.implement";
import { LightProp, LightConfig } from "./light.dto";

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
      this.lightList.push(light);
    }
  }

  public async getLightList(): Promise<LightProp[]> {
    const configList = [];
    for (let light of this.lightList) {
      let config = await light.queryChannelConfig(light.channel);
      const lightProp = {
        ...light.lightConfig,
        ...config,
      } as LightProp;
      configList.push(lightProp);
    }
    return configList;
  }

  // 打开/关闭光源
  public async openLight(id: number, open: number) {
    const { idx, channel } = this.getIdxAndChannelById(id);
    return this.lightList[idx].openLight(channel, open);
  }

  // 设置亮度
  public async setLightness(id: number, lightness: number) {
    const { idx, channel } = this.getIdxAndChannelById(id);
    return this.lightList[idx].setLightness(channel, lightness);
  }

  // 设置触发方式
  public async setLightTrigger(id: number, trigger: number) {
    const { idx, channel } = this.getIdxAndChannelById(id);
    return this.lightList[idx].setLightTrigger(channel, trigger);
  }

  // 设置发光时间
  public async setLightDelay(id: number, time: number) {
    const { idx, channel } = this.getIdxAndChannelById(id);
    return this.lightList[idx].setLightDelay(channel, time);
  }

  // 查询某光源所有配置
  public async queryAllConfig(id: number) {
    const { idx, channel } = this.getIdxAndChannelById(id);
    return await this.lightList[idx].queryAllConfig();
  }

  // 查询某光源指定通道配置
  public async queryChannelConfig(id: number) {
    const { idx, channel } = this.getIdxAndChannelById(id);
    return await this.lightList[idx].queryChannelConfig(channel);
  }

  private getIdxAndChannelById(id: number) {
    for (let [idx, light] of this.lightList.entries()) {
      if (light.id === id) {
        return { idx, channel: light.channel };
      }
    }
    throw new Error(`id为${id}的光源不存在，请检查配置`);
  }
}
