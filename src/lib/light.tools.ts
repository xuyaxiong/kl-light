import { LTF } from "./light.dto";

export default class Tools {
  // eg: "$L0=50,T0=100,F0=1#"
  public static parseChannelConfig(configStr: string): LTF {
    const channelConfig = new Map<string, number>();
    const trimConfigStr = configStr.slice(1, configStr.length - 1);
    const configStrArray = trimConfigStr.split(",");
    configStrArray.map((item) => {
      const [key, val] = item.split("=");
      channelConfig.set(key[0], parseInt(val));
    });
    return Object.fromEntries(channelConfig) as unknown as LTF;
  }

  // eg: "$ID=0,L0=74,T0=100,F0=1,L1=0,T1=100,F1=1,L2=100,T2=100,F2=1,L3=100,T3=100,F3=1,TR=0,FQ=0,FI=0,LC=0,PW=0,NE=2,IP=192.168.1.2,IU=255.255.255.0,ALT11=1,IS=192.168.1.1,IL=1200,DP=192.168.1.3,DL=1200,MC=89438940348200D0#"
  public static parseAllConfig(configStr: string) {
    const channelConfigList: any[] = [];
    const globalConfig = new Map<string, string>();
    const trimConfigStr = configStr.slice(1, configStr.length - 1);
    const configStrArray = trimConfigStr.split(",");
    configStrArray.map((item) => {
      const [key, val] = item.split("=");
      const channelNum = Tools.getChannelNum(key);
      if (channelNum !== -1) {
        const channelConfig = channelConfigList[channelNum];
        if (channelConfig) channelConfig[key[0]] = val;
        else {
          channelConfigList[channelNum] = {};
          channelConfigList[channelNum][key[0]] = val;
        }
      } else {
        globalConfig.set(key, val);
      }
    });
    return { channelConfigList, globalConfig };
  }

  private static getChannelNum(key: string): number {
    if (Tools.isPvtKey(key)) return Number(key.slice(1));
    return -1;
  }

  // 各通道私有的配置
  private static isPvtKey(key: string): boolean {
    return [/^L\d$/, /^T\d$/, /^F\d$/].some((pattern) => pattern.test(key));
  }
}
