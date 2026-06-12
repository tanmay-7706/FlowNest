import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInFile(filePath, replacements) {
    const fullPath = path.resolve(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    for (let r of replacements) {
        content = content.replace(r.search, r.replace);
    }
    fs.writeFileSync(fullPath, content);
}

const dirsToScan = ['./src/components', './src/pages'];
const allFiles = [];
function scanDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            allFiles.push(fullPath);
        }
    });
}
dirsToScan.forEach(scanDir);

for (let file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('import { motion') || content.includes('import { AnimatePresence, motion }') || content.includes('import { motion, AnimatePresence }')) {
        const motionUsages = (content.match(/<motion\./g) || []).length + (content.match(/motion\(/g) || []).length;
        if (motionUsages === 0) {
            content = content.replace(/,\s*motion\b/, '');
            content = content.replace(/\bmotion\s*,\s*/, '');
            content = content.replace(/import\s*{\s*motion\s*}\s*from\s*['"]framer-motion['"];?\n?/, '');
            content = content.replace(/import\s*{\s*}\s*from\s*['"]framer-motion['"];?\n?/, '');
        }
    }
    fs.writeFileSync(file, content);
}

replaceInFile('./src/components/AITaskAssistant.jsx', [
    { search: /import { useState, useEffect } from 'react'/, replace: "import { useState } from 'react'" }
]);
replaceInFile('./src/components/AIScheduleOptimizer.jsx', [
    { search: /import { useState, useEffect } from 'react'/, replace: "import { useState } from 'react'" }
]);
replaceInFile('./src/components/GoogleCalendarIntegration.jsx', [
    { search: /} catch \(error\) {/g, replace: "} catch (err) {" },
    { search: /checkConnection\(\)\n {2}}, \[\]\)/, replace: "checkConnection()\n  // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [])" }
]);
replaceInFile('./src/components/QuoteCarousel.jsx', [
    { search: /const { currentUser } = useAuth\(\)\n/, replace: "" }
]);
replaceInFile('./src/pages/Auth.jsx', [
    { search: / {2}const handleGithubAuth = async \(\) => \{[\s\S]*?setLoading\(false\)\n {2}\}\n/m, replace: "" },
    { search: / {2}const handleAppleAuth = \(\) => \{\n {4}setError\("Apple Sign-In coming soon!"\)\n {2}\}\n/m, replace: "" },
    { search: /, GithubAuthProvider/, replace: "" }
]);
replaceInFile('./src/pages/CalendarView.jsx', [
    { search: / {2}const \[loading, setLoading\] = useState\(false\)\n/, replace: "" },
    { search: / {2}const connectGoogleCalendar = async \(\) => \{[\s\S]*?\}\n/m, replace: "" },
    { search: /\[currentUser, currentMonth, currentYear\]\)/, replace: "[currentUser, currentMonth, currentYear, mockEvents])" }
]);
replaceInFile('./src/pages/Home.jsx', [
    { search: /const Home = \(\{ widgets \}\) => \{/, replace: "const Home = () => {" }
]);
replaceInFile('./src/pages/Profile.jsx', [
    { search: /\[currentUser\]\)/, replace: "[currentUser, getUserDisplayName])" }
]);
replaceInFile('./src/services/AnalyticsService.js', [
    { search: /, limit } from "firebase\/firestore"/, replace: "} from \"firebase/firestore\"" }
]);
replaceInFile('./src/services/QuoteService.js', [
    { search: /} catch \(parseError\) {/, replace: "} catch (err) {" }
]);
replaceInFile('./src/services/__tests__/OpenRouterService.test.js', [
    { search: /const { getFunctions, httpsCallable } = require\('firebase\/functions'\);/, replace: "const { httpsCallable } = require('firebase/functions');" }
]);
replaceInFile('./src/utils/firebase.js', [
    { search: /import { getFirestore } from "firebase\/firestore"\n/, replace: "" },
    { search: /export const db = getFirestore\(app\)/, replace: "import { getFirestore } from 'firebase/firestore'\nexport const db = getFirestore(app)" }
]);
replaceInFile('./vite.config.js', [
    { search: /import path from 'path';/, replace: "import path from 'path';\nimport { fileURLToPath } from 'url';\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);" }
]);
replaceInFile('./src/hooks/__tests__/useFirestore.test.js', [
    { search: /const { result } = renderHook\(\(\) => useFirestore\('test-collection'\)\);/, replace: "renderHook(() => useFirestore('test-collection'));" }
]);
replaceInFile('./src/hooks/useFirestore.js', [
    { search: /\[collectionName\]\)/, replace: "[collectionName, queryConstraints])" }
]);
replaceInFile('./src/context/AuthContext.jsx', [
    { search: /export const useAuth = \(\) => \{/, replace: "// eslint-disable-next-line react-refresh/only-export-components\nexport const useAuth = () => {" }
]);
replaceInFile('./src/context/ThemeContext.jsx', [
    { search: /export const useTheme = \(\) => \{/, replace: "// eslint-disable-next-line react-refresh/only-export-components\nexport const useTheme = () => {" }
]);

