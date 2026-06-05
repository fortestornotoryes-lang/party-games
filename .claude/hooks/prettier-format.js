const { execSync } = require('child_process');
const path = require('path');

let data = '';
process.stdin.on('data', chunk => (data += chunk));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const filePath = (input.tool_input || {}).file_path || '';

    if (!filePath || !/\.(tsx?|jsx?|css|json)$/.test(filePath)) return;

    const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    execSync(`npx prettier --write "${abs}"`, { stdio: 'ignore' });
  } catch (_) {
    // fail open — never block the edit
  }
});