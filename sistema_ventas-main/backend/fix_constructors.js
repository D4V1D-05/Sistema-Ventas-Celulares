const fs = require('fs');
const path = require('path');

function generateConstructor(content, className) {
    // Find final fields
    const fieldRegex = /private\s+final\s+([\w<>]+)\s+(\w+);/g;
    let match;
    const fields = [];
    
    while ((match = fieldRegex.exec(content)) !== null) {
        fields.push({ type: match[1], name: match[2] });
    }

    if (fields.length === 0) return '';

    const args = fields.map(f => `${f.type} ${f.name}`).join(', ');
    let result = `\n    public ${className}(${args}) {\n`;
    fields.forEach(f => {
        result += `        this.${f.name} = ${f.name};\n`;
    });
    result += `    }\n`;

    return result;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.java')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            let changed = false;
            
            // Fix getActivo issue
            if (content.includes('getActivo()')) {
                content = content.replace(/getActivo\(\)/g, 'isActivo()');
                changed = true;
            }

            if (content.includes('@RequiredArgsConstructor')) {
                content = content.replace(/import lombok\.RequiredArgsConstructor;\n/g, '');
                content = content.replace(/@RequiredArgsConstructor\s*\n/g, '');
                
                const classNameMatch = /public\s+class\s+(\w+)/.exec(content);
                if (classNameMatch) {
                    const className = classNameMatch[1];
                    const constructor = generateConstructor(content, className);
                    
                    // Insert after the class declaration
                    const classDeclIndex = content.indexOf(`public class ${className}`);
                    const firstBraceIndex = content.indexOf('{', classDeclIndex);
                    
                    if (firstBraceIndex !== -1) {
                        content = content.substring(0, firstBraceIndex + 1) + constructor + content.substring(firstBraceIndex + 1);
                        changed = true;
                    }
                }
            }
            
            if (changed) {
                fs.writeFileSync(fullPath, content);
                console.log(`Fixed: ${file}`);
            }
        }
    });
}

const basePath = path.join(__dirname, 'src', 'main', 'java', 'com', 'sistema', 'ventas');
processDirectory(path.join(basePath, 'controller'));
processDirectory(path.join(basePath, 'service'));
processDirectory(path.join(basePath, 'config'));
console.log('Constructors generated.');
