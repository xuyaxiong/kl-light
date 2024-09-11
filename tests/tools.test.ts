import Tools from "../src/lib/light.tools";

test("Tools::parseChannelConfig", () => {
  const ltf = Tools.parseChannelConfig("$L0=50,T0=100,F0=1#");
  expect(ltf.L).toBe(50);
  expect(ltf.T).toBe(100);
  expect(ltf.F).toBe(1);
});

test("Tools::parseAllConfig", () => {
  const config = Tools.parseAllConfig(
    "$ID=0,L0=74,T0=100,F0=1,L1=0,T1=100,F1=1,L2=100,T2=100,F2=1,L3=100,T3=100,F3=1,TR=0,FQ=0,FI=0,LC=0,PW=0,NE=2,IP=192.168.1.2,IU=255.255.255.0,ALT11=1,IS=192.168.1.1,IL=1200,DP=192.168.1.3,DL=1200,MC=89438940348200D0#"
  );
  expect(config.channelConfigList.length).toBe(4);
});
