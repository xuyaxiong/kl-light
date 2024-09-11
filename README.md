# 考拉悠然光源控制

### 1. 关键数据结构
```typescript
interface LightConfig {
  id: number; // 自定义id
  name: string; // 自定义名称
  ip: string; // 光源IP地址
  port: number; // 端口号
  mask: string; // 子网掩码
  channel: number; // 通道
}

interface LightProp {
  id: number;
  name: string;
  ip: string;
  port: number;
  mask: string;
  channel: number;
  L: number; // 当前亮度
  T: number; // 当前发光时间
  F: number; // 通道开关 ON：1 OFF：0
}
```

### 2. API
+ 获取光源列表
```typescript
public async getLightList(): Promise<LightProp[]>;
```
+ 打开/关闭通道
```typescript
public async openLight(lightIdx: number, channel: number, open: number);
```
+ 设置通道亮度
```typescript
public async setLightness(lightIdx: number, channel: number, lightness: number);
```
+ 设置通道触发方式
```typescript
public async setLightTrigger(lightIdx: number, channel: number, trigger: number);
```
+ 设置通道发光时间
```typescript
public async setLightDelay(lightIdx: number, channel: number, time: number);
```

### 3. 示例
```typescript
import { LightUtil } from "kl-light";

const lightUtil = new LightUtil([
  {
    id: 1,
    name: "同轴光源",
    ip: "192.168.1.2",
    port: 1200,
    mask: "255.255.255.0",
    channel: 0,
  },
]);
(async () => {
  for (let i = 0; i < 100; ++i) {
    await lightUtil.setLightness(0, 2, i % 256);
  }
})();
```
