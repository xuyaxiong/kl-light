import LightIns from "../src/lib/light.ins";

test("LightIns::getQueryAllConfigIns", () => {
  const ins = LightIns.getQueryAllConfigIns();
  expect(ins).toBe("$RD=9999#");
});

test("LightIns::getQueryChannelConfigIns", () => {
  const ins = LightIns.getQueryChannelConfigIns(1);
  expect(ins).toBe("$RD=1#");
});

test("LightIns::getSetChannelLightnessIns", () => {
  const ins = LightIns.getSetChannelLightnessIns(1, 100);
  expect(ins).toBe("$L1=100#");
});

test("LightIns::getSetLightTriggerIns", () => {
  const ins = LightIns.getSetLightTriggerIns(1, 3);
  expect(ins).toBe("$TR=3#");
});

test("LightIns::getSetLightDelayIns", () => {
  const ins = LightIns.getSetLightDelayIns(1, 150);
  expect(ins).toBe("$T1=150#");
});

test("LightIns::getOpenLightIns", () => {
  const ins = LightIns.getOpenLightIns(1, 1);
  expect(ins).toBe("$F1=1#");
});
