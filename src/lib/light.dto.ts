export interface LTF {
  L: number;
  T: number;
  F: number;
}

export interface LightConfig {
  id: number;
  name: string;
  ip: string;
  port: number;
  mask: string;
  channel: number;
}

export interface LightProp extends LTF, LightConfig {}
