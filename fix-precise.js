import fs from 'fs';
import { execSync } from 'child_process';

// Run eslint to get JSON output
try {
  execSync('npx eslint . --format json > lint-results.json', { stdio: 'pipe' });
} catch (e) {
  // eslint exits with 1 if there are errors, but we still get the json
}

const results = JSON.parse(fs.readFileSync('lint-results.json', 'utf8'));

results.forEach(fileResult => {
  if (fileResult.messages.length === 0) return;
  
  const filePath = fileResult.filePath;
  let lines = fs.readFileSync(filePath, 'utf8').split('\n');
  
  // Apply changes from bottom to top so line numbers don't shift
  const messages = fileResult.messages.sort((a, b) => {
    if (b.line === a.line) return b.column - a.column;
    return b.line - a.line;
  });

  messages.forEach(msg => {
    if (msg.ruleId === 'no-unused-vars') {
      const lineIdx = msg.line - 1;
      let lineText = lines[lineIdx];
      
      // Specifically target "motion"
      if (msg.message.includes("'motion'")) {
        lineText = lineText.replace(/,\s*motion\b/g, '');
        lineText = lineText.replace(/\bmotion\s*,\s*/g, '');
        lineText = lineText.replace(/import\s*{\s*motion\s*}\s*from\s*['"]framer-motion['"];?/g, '');
        lineText = lineText.replace(/import\s*{\s*}\s*from\s*['"]framer-motion['"];?/g, '');
        if (lineText.trim() === "import  from 'framer-motion';" || lineText.trim() === 'import { } from "framer-motion";' || lineText.trim() === "import { } from 'framer-motion'") {
           lineText = "";
        }
      }
      // Target other specific ones like 'err'
      else if (msg.message.includes("'err'")) {
         lineText = lineText.replace('err', '_err');
      }
      else if (msg.message.includes("'useAuth'")) {
         lineText = lineText.replace(/,\s*useAuth\b/g, '');
      }
      else if (msg.message.includes("'prev'")) {
         lineText = lineText.replace('prev', '_prev');
      }
      else if (msg.message.includes("'editingGoal'")) {
         lineText = lineText.replace('editingGoal', '_editingGoal');
      }
      else if (msg.message.includes("'setIsGoogleConnected'")) {
         lineText = lineText.replace('setIsGoogleConnected', '_setIsGoogleConnected');
      }
      else if (msg.message.includes("'limit'")) {
         lineText = lineText.replace(/,\s*limit\b/g, '');
      }
      else if (msg.message.includes("'getFirestore'")) {
         lineText = lineText.replace(/,\s*getFirestore\b/g, '');
      }
      else if (msg.message.includes("'getFunctions'")) {
         lineText = lineText.replace(/,\s*getFunctions\b/g, '');
      }
      else if (msg.message.includes("'result'")) {
         lineText = lineText.replace('result', '_result');
      }
      else if (msg.message.includes("'addTodo'")) {
         lineText = lineText.replace(/,\s*addTodo\b/g, '');
      }
      else if (msg.message.includes("'currentUser'")) {
         lineText = lineText.replace(/,\s*currentUser\b/g, '');
         lineText = lineText.replace(/\bcurrentUser\s*,\s*/g, '');
      }
      
      lines[lineIdx] = lineText;
    }
  });
  
  fs.writeFileSync(filePath, lines.join('\n'));
});
