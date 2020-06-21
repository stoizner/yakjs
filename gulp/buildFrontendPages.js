'use strict';

const fg = require('fast-glob');
const Mustache = require('mustache');
const fs = require('fs-extra');
const path = require('path');

async function buildFrontendPages() {
    const frontEndPagesPath = path.posix.resolve('../src/frontend/pages');
    const frontEndPartialsPath = path.posix.resolve('../src/frontend/partials');
    const distPath = path.posix.resolve('../frontend');

    const pagePattern = `${frontEndPagesPath}/*.mustache`;
    const pageFiles = await fg([pagePattern]);
    const pages = await readFiles(pageFiles);

    const partialPattern = `${frontEndPartialsPath}/*.mustache`;
    const partialFiles = await fg([partialPattern]);
    const partials = await readFiles(partialFiles);
    const partialsMap = createFileItemMap(partials);

    // console.log(pages);
    // console.log(partials);

    const renderedPages = pages.map(page => renderPage(page, {}, partialsMap));
    const finalPages = renderedPages.map(useIndexBasedNames);

    for(const page of finalPages) {
        const targetFilename = `${distPath}/${page.name}.html`;
        await fs.ensureDir(path.dirname(targetFilename));
        await fs.writeFile(targetFilename, page.content);
    }
}

/**
 * @param {FileItem} page
 * @param {Object<string, string>} partialsMap
 * @param {object} view
 * @returns {FileItem}
 */
function renderPage(page, view, partialsMap) {
    const renderedContent = Mustache.render(page.content, view, partialsMap);

    return new FileItem(page.name, renderedContent);
}

/**
 * @param {<Array<FileItem>} fileItems
 */
function createFileItemMap(fileItems) {
    return fileItems.reduce((map, current) => {
        map[current.name] = current.content;
        return map;
    }, {})
}

/**
 * @param  {Array<string>} files
 * @returns {Promise<Array<FileItem>>}
 */
async function readFiles(files) {
    const fileItems = [];

    for(const filename of files) {
        const content = await fs.readFile(filename, 'utf8');
        const name = path.basename(filename, path.extname(filename));

        fileItems.push(new FileItem(name, content));
    }

    return fileItems;
}

/**
 * @param {FileItem} fileItem
 */
function useIndexBasedNames(fileItem) {
    let name = fileItem.name;

    if (!name.startsWith('index')) {
        name = `${name}/index`;
    }

    return new FileItem(name, fileItem.content);
}

class FileItem {
    constructor(name, content) {
        this.name = name;
        this.content = content;
    }
}

module.exports = {buildFrontendPages};
