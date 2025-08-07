import fs from 'fs/promises';
import path from 'path';

async function grep(pattern, filename) {
    const lines = (await fs.readFile(filename, 'utf-8')).split('\n');
    lines.forEach((line) => {
       if (pattern.test(line)) console.log(`${filename}:${line}`);
    })

}

async function getFiles(directory) {
    let filenames = await fs.readdir(directory)
    let folders = []
    for (const filename of filenames) {
        const filePath = path.join(directory, filename)
        const stats = await fs.stat(filePath)
        if (stats.isFile()) {
            await grep(/Nirvana/, filePath)
        } else {
            folders.push(filePath)
        }
    }
    folders.forEach(async (folder) => {
        await getFiles(folder)
    })
}

// grep(/J/, './test/rockbands.txt')
getFiles('./test')