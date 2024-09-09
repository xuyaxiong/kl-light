export interface LightPropDTO {
  ip: string;
  port: number;
  mask: string;
  channel: number;
  name: string;
  id: number;
  L: number;
  T: number;
  F: number;
}

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
