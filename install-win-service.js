const sudo = require('sudo-prompt')
const fs = require('fs');
const path = require('path')

const serviceName = 'ListenTunService';
const binPath = path.join(__dirname, 'mihomo.exe');
const configDir = path.join(__dirname, 'config');
const configPath = path.join(__dirname, 'mihomo-config.yaml');


const wrapperPath = path.join(__dirname, 'listen-mihomo-service.exe'); // 你下载的 WinSW

// 1. 动态生成 XML 配置文件
const xmlContent = `
<service>
  <id>${serviceName}</id>
  <name>${serviceName}</name>
  <description>Listen TUN Mode Service</description>
  <executable>${binPath}</executable>
  <arguments>-d "${configDir}" -f "${configPath}"</arguments>
  <log mode="roll"></log>
  <onfailure action="restart" delay="10 sec"/>
</service>
`;

fs.writeFileSync(path.join(__dirname, 'listen-mihomo-service.xml'), xmlContent);

const command = `"${wrapperPath}" install && "${wrapperPath}" start`;
sudo.exec(command, { name: 'Listen Tun Installer' }, (err) => {
  if (err) {
    console.error('注册失败:', err)
  } else {
    console.log('服务已成功作为原生二进制运行！')
  }
});