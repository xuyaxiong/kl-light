export default class LightIns {
  public static getQueryAllConfigIns() {
    const action = `RD=9999`;
    return this.actionWrapper(action);
  }

  public static getQueryChannelConfigIns(channel: number) {
    const action = `RD=${channel}`;
    return LightIns.actionWrapper(action);
  }

  public static getSetChannelLightnessIns(channel: number, lightness: number) {
    const action = `L${channel}=${lightness}`;
    return LightIns.actionWrapper(action);
  }

  public static getSetLightTriggerIns(channel: number, trigger: number) {
    const action = `TR=${trigger}`;
    return LightIns.actionWrapper(action);
  }

  public static getSetLightDelayIns(channel: number, time: number) {
    const action = `T${channel}=${time}`;
    return LightIns.actionWrapper(action);
  }

  public static getOpenLightIns(channel: number, open: number) {
    const action = `F${channel}=${open}`;
    return LightIns.actionWrapper(action);
  }

  private static actionWrapper(action: string) {
    return `$${action}#`;
  }
}
