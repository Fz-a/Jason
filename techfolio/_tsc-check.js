const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit', { cwd: 'D:/Download/Jason/techfolio', encoding: 'utf8', timeout: 180000, stdio: ['ignore', 'pipe', 'pipe'] });
  console.log('tsc clean');
} catch (e) {
  console.log('TSC ERR:\n' + ((e.stdout || '') + (e.stderr || '')));
}
