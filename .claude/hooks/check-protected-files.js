/**
 * PreToolUse hook — blocks edits to protected files.
 * Called by the Claude Code harness before Edit/Write tool calls.
 * Reads tool input from stdin as JSON.
 */
let data = '';
process.stdin.on('data', chunk => (data += chunk));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const filePath = (input.tool_input || {}).file_path || '';

    if (/\.env$/.test(filePath)) {
      console.error('BLOCKED: .env files are protected — they contain GEMINI_API_KEY. Edit .env.example instead.');
      process.exit(2);
    }

    if (filePath.includes('package-lock.json')) {
      console.error('BLOCKED: package-lock.json must only be modified by npm. Run `npm install` instead.');
      process.exit(2);
    }
  } catch (e) {
    // Parsing failed — allow the action (fail open)
  }
});