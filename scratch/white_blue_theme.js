const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, '../src'));

let modifiedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Remove dark: classes and trailing space
    content = content.replace(/dark:[a-zA-Z0-9-/[\]_.]+\s?/g, '');

    // Replace grays with blue
    content = content.replace(/\bzinc-/g, 'blue-');
    content = content.replace(/\bslate-/g, 'blue-');
    content = content.replace(/\bgray-/g, 'blue-');
    content = content.replace(/\bneutral-/g, 'blue-');
    content = content.replace(/\bstone-/g, 'blue-');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Updated: ${file}`);
    }
}

console.log(`\nTotal files modified: ${modifiedCount}`);
