# 考拉悠然光源控制

### 1. 用法
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
