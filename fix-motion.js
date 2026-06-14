import fs from 'fs';
import path from 'path';

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const files = findFiles('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<motion.') || content.includes('AnimatePresence')) {
    let hasMotionImport = content.includes("import { motion") || content.includes("import { AnimatePresence, motion") || content.includes("import { motion, AnimatePresence");
    let hasAnimatePresenceImport = content.includes("import { AnimatePresence");
    
    if (!hasMotionImport) {
        if(content.includes('<motion.')) {
            // we need to add motion
            content = "import { motion } from 'framer-motion';\n" + content;
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Added motion to ${file}`);
        }
    }
  }
});
