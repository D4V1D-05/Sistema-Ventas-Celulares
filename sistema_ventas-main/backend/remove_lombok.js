const fs = require('fs');
const path = require('path');

function generateMethods(content, className) {
    let result = '';
    
    // Find all fields
    const fieldRegex = /private\s+([\w<>]+)\s+(\w+)\s*(?:=\s*[^;]+)?;/g;
    let match;
    const fields = [];
    
    while ((match = fieldRegex.exec(content)) !== null) {
        fields.push({ type: match[1], name: match[2] });
    }

    // Generate NoArgsConstructor
    result += `\n    public ${className}() {\n    }\n`;

    // Generate AllArgsConstructor
    if (fields.length > 0) {
        const args = fields.map(f => `${f.type} ${f.name}`).join(', ');
        result += `\n    public ${className}(${args}) {\n`;
        fields.forEach(f => {
            result += `        this.${f.name} = ${f.name};\n`;
        });
        result += `    }\n`;
    }

    // Generate Getters and Setters
    fields.forEach(f => {
        const capitalized = f.name.charAt(0).toUpperCase() + f.name.slice(1);
        const getterPrefix = f.type === 'boolean' || f.type === 'Boolean' ? 'is' : 'get';
        
        result += `\n    public ${f.type} ${getterPrefix}${capitalized}() {\n`;
        result += `        return ${f.name};\n`;
        result += `    }\n`;

        result += `\n    public void set${capitalized}(${f.type} ${f.name}) {\n`;
        result += `        this.${f.name} = ${f.name};\n`;
        result += `    }\n`;
    });

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
            
            // Only process if it has Lombok imports/annotations
            if (content.includes('lombok.')) {
                // Remove lombok imports
                content = content.replace(/import lombok\.[^;]+;\n/g, '');
                
                // Remove class level annotations
                content = content.replace(/@Data\s*\n/g, '');
                content = content.replace(/@NoArgsConstructor\s*\n/g, '');
                content = content.replace(/@AllArgsConstructor\s*\n/g, '');
                content = content.replace(/@Builder\s*\n/g, '');
                
                // Find class end
                const classNameMatch = /public\s+class\s+(\w+)/.exec(content);
                if (classNameMatch) {
                    const className = classNameMatch[1];
                    const lastBraceIndex = content.lastIndexOf('}');
                    
                    if (lastBraceIndex !== -1) {
                        const methods = generateMethods(content, className);
                        content = content.substring(0, lastBraceIndex) + methods + '}\n';
                        fs.writeFileSync(fullPath, content);
                        console.log(`Processed: ${file}`);
                    }
                }
            }
        }
    });
}

const basePath = path.join(__dirname, 'src', 'main', 'java', 'com', 'sistema', 'ventas');
processDirectory(path.join(basePath, 'model'));
processDirectory(path.join(basePath, 'dto'));
console.log('Lombok removal complete.');
