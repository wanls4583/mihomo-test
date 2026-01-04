const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

// --- 配置区 ---
const TARGET_PROXY = { host: '127.0.0.1', port: 8866 };
const CONFIG_PATH = path.join(__dirname, 'mihomo-config.yaml');

// 1. 定义 Mihomo (Clash Meta) 配置对象
const mihomoConfig = {
  mode: 'rule',
  'ipv6': false,
  'mixed-port': 7890,
  'allow-lan': true,
  'log-level': 'info',
  'external-controller': '127.0.0.1:9090', // API 控制端口

  // TUN 模式配置
  tun: {
    enable: true,
    stack: 'system', // 或 gvisor
    'auto-route': true,
    'auto-detect-interface': true,
    'strict-route': true,
    'skip-proxy-address-whitelist': ['127.0.0.1/32', '::1/128']
  },

  // DNS 与 Fake-IP 配置
  dns: {
    enable: true,
    listen: '0.0.0.0:1053',
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/16',
    'nameserver': ['223.5.5.5', '119.29.29.29'],
  },

  // 代理服务器定义
  proxies: [
    {
      name: 'Forward-Proxy',
      type: 'http', // 如果 8866 是 socks5，请改为 socks5
      server: TARGET_PROXY.host,
      port: TARGET_PROXY.port
    }
  ],

  // 代理组
  'proxy-groups': [
    {
      name: 'Default',
      type: 'select',
      proxies: ['Forward-Proxy', 'DIRECT']
    }
  ],

  // 路由规则
  rules: [
    'AND,((NETWORK,UDP)),DIRECT',
    'PROCESS-NAME,listen-server.exe,DIRECT',
    'PROCESS-NAME,listen-server,DIRECT',
    'DST-PORT,8866,DIRECT',
    // 'SRC-PORT,8866,DIRECT', // 无效，代理服务器发起请求时，端口号是随机的
    // 其余流量全部走代理
    'MATCH,Default'
  ]
};

// 2. 将对象转换为 YAML 并写入文件
try {
  const yamlStr = YAML.stringify(mihomoConfig);
  fs.writeFileSync(CONFIG_PATH, yamlStr, 'utf8');
  console.log('[Config] config.yaml 已生成');
} catch (e) {
  console.error('[Error] 生成配置失败:', e);
}