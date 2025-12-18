const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = 'TOAN_BO_SOURCE_CODE.txt';
// Danh sách folder/file cần BỎ QUA (Bảo mật & Rác)
const IGNORE_LIST = ['node_modules', '.git', '.expo', 'dist', 'build', 'package-lock.json', '.DS_Store', 'merge_code.js', OUTPUT_FILE, '.env'];
// Các đuôi file muốn lấy
const ALLOWED_EXTS = ['.ts', '.tsx', '.js', '.json', '.sql', '.md'];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (IGNORE_LIST.includes(file)) return;

        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (ALLOWED_EXTS.includes(path.extname(file))) {
                arrayOfFiles.push(fullPath);
            }
        }
    });
    return arrayOfFiles;
}

const allFiles = getAllFiles(__dirname);
let content = `--- SOURCE CODE PROJECT MOMO AI ---\nUpdated: ${new Date().toLocaleString()}\n\n`;

allFiles.forEach(filePath => {
    content += `\n\n========================================\nFILE: ${path.relative(__dirname, filePath)}\n========================================\n`;
    try { content += fs.readFileSync(filePath, 'utf8'); } catch (e) { content += '[Error reading file]'; }
});

fs.writeFileSync(OUTPUT_FILE, content);
console.log(`✅ XONG! Đã gộp code vào file: ${OUTPUT_FILE}`);