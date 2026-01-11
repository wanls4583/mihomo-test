const sudo = require('sudo-prompt')

const serviceName = 'ListenTunService'
const command = `sc stop ${serviceName} & sc delete ${serviceName} & sc stop ${serviceName}_DNS & sc delete ${serviceName}_DNS`

sudo.exec(command, { name: 'Uninstall Tun Service' }, (err, stdout, stderr) => {
  console.log('err:', err)
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
})