const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'src', 'assets', 'css');

function removeDarkMedia(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace hardcoded light mode backgrounds in navbar
    content = content.replace(/background: rgba\(248, 250, 252, 0\.85\);/g, 'background: rgba(10, 10, 15, 0.85);');
    content = content.replace(/background: rgba\(248, 250, 252, 0\.95\);/g, 'background: rgba(10, 10, 15, 0.95);');

    // Replace hardcoded light mode white backgrounds
    content = content.replace(/background: rgba\(255, 255, 255, 0\.[0-9]+\);/g, 'background: var(--color-bg-surface);');
    content = content.replace(/border: 1px solid rgba\(255, 255, 255, 0\.[0-9]+\);/g, 'border: 1px solid var(--color-border);');

    // Remove the @media (prefers-color-scheme: dark) { ... } wrapper but keep the inner content
    const mediaRegex = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{([\s\S]*?^)\}/gm;
    content = content.replace(mediaRegex, (match, p1) => {
        // p1 is the content inside the media query
        // remove one level of indentation if it exists
        return p1.replace(/^  /gm, '');
    });

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned ${file}`);
}

removeDarkMedia(path.join(cssDir, 'components.css'));
removeDarkMedia(path.join(cssDir, 'layout.css'));
