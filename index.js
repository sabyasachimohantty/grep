#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { Command } from 'commander';
import getStdin from './getStdin.js';

const program = new Command()

program
    .name('Grabb')
    .description('A finder tool')
    .version('1.0.0')

program
    .argument('<pattern>')
    .argument('[filename]')
    .option('-r')
    .option('-v')
    .option('-i')

program.parse(process.argv)

const options = program.opts()
const [patternString, filename] = program.args
const regex = new RegExp(patternString, `${options.i ? "i" : ""}`)
grep(regex, filename)

async function grep(pattern, filename) {
    let lines;
    try {
        if (!filename || filename === '-') {
            lines = (await getStdin()).trim().split('\n');
        } else {
            const stats = await fs.stat(filename)
            if (!stats.isFile()) return processFiles(filename)
            lines = (await fs.readFile(filename, 'utf-8')).trim().split('\n');
        }
    } catch (error) {
        console.log(error)
    }

    lines.forEach((line) => {
        if (options.v) {
            if (!pattern.test(line)) console.log(`${options.r ? filename + ":" : ""}${line}`);
        } else {
            if (pattern.test(line)) console.log(`${options.r ? filename + ":" : ""}${line}`);
        }
    })

}

async function processFiles(directory) {
    let filenames = await fs.readdir(directory)
    let folders = []
    for (const filename of filenames) {
        const filePath = path.join(directory, filename)
        const stats = await fs.stat(filePath)
        if (stats.isFile()) {
            await grep(regex, filePath)
        } else {
            folders.push(filePath)
        }
    }
    folders.forEach(async (folder) => {
        await processFiles(folder)
    })
}
