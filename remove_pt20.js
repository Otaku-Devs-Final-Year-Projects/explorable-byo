const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk('c:/Users/Brian/Documents/FINAL YEAR PROJECTS/explorable-byo/app').filter(f => f.endsWith('.tsx') && !f.includes('PageWrapper.tsx'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('pt-20')) {
        content = content.replace(/pt-20/g, ''); // replaces all instances
        // cleanup double spaces
        content = content.replace(/  +/g, ' ');
        content = content.replace(/ "/g, '"');
        fs.writeFileSync(file, content);
    }
});
