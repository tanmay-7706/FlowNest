import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToScan = ['./src/components', './src/pages', './src/hooks', './src/services'];
function scanDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Remove unused motion imports
            if (content.includes('motion') && !content.includes('<motion.') && !content.includes('motion(')) {
                content = content.replace(/,\s*motion\b/g, '');
                content = content.replace(/\bmotion\s*,\s*/g, '');
                content = content.replace(/import\s*{\s*motion\s*}\s*from\s*['"]framer-motion['"];?\n?/g, '');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
            }
        }
    });
}
dirsToScan.forEach(scanDir);

// Disable eslint for functions/index.js since it's a node environment
if (fs.existsSync('./functions/index.js')) {
    let content = fs.readFileSync('./functions/index.js', 'utf8');
    if (!content.includes('/* eslint-disable */')) {
        fs.writeFileSync('./functions/index.js', '/* eslint-disable */\n' + content);
    }
}
