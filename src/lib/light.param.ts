export interface SetLightnessParam {
  lightId: number;
  lightness: number;
}

export interface SetLightTriggerParam {
  lightId: number;
  trigger: number;
}

export interface SetLightDelayParam {
  lightId: number;
  time: number;
}

export interface OpenLightParam {
  lightId: number;
  open: number;
}
