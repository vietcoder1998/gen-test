require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { FULL_PATH, TEST_DIR_NAME, SCAN_DIR_NAME } = require('.');
const genCode = require('./generator/gen-test-suit');

function applyContext(context, regexDataList) {
    let newContext = context;
    regexDataList.forEach((item) => {
        const { pattern, value } = item;
        newContext = context.replaceAll(pattern.source, value);
    });

    return newContext;
}

// write context to test file
async function writeFile(dir, name) {
    const divideName = name.split('.');
    const testNameFile = [divideName[0], 'test', divideName?.at(-1)].join('.');
    const testPath = path.join(dir, testNameFile);
    const isFileExists = await fs.existsSync(testPath);

    // if file not exits gen code other wise doesn`t
    if (!isFileExists) {
        // gen code in here
        console.log('Generate to file', testPath);
        const newContext = await genCode.generateTestFile(divideName[0], divideName?.at(-1));
        await fs.writeFileSync(testPath, newContext);
    } else {
        console.log(`File exist ${testPath} and not override`);
    }
}

function init() {
    generateData('modules');
}

// generate data
async function generateData(parentName) {
    const genPath = path.join(FULL_PATH, parentName);
    const isDirExists = await fs.existsSync(genPath);

    if (isDirExists) {
        const pathList = await fs.readdirSync(genPath);

        for (const itemPath of pathList) {
            if (!isFile(itemPath)) {
                const nextParentPath = path.join(parentName, itemPath);

                generateData(nextParentPath);
            } else writeFile(genPath, itemPath);
        }
    }
}

/**
 * Generate multiple tests file
 *
 * @param   {string[]}  pathList
 *
 * @return  {void}            [return description]
 */
async function generateMultipleTestFile(parentName, pathList) {
    for (const itemPath of pathList) {
        // create path for page
        const fullPathPage = path.resolve(FULL_PATH, parentName, itemPath);
        const isDirPage = await fs.existsSync(fullPathPage);

        // generate if test not exists
        if (isDirPage) {
            const parentPath = fullPathPage.replace(SCAN_DIR_NAME, TEST_DIR_NAME);
            const isTestPage = await fs.existsSync(parentPath);

            if (!isTestPage) {
                await fs.mkdirSync(parentPath);
            }

            const fileNames = await fs.readdirSync(fullPathPage);

            if (fileNames && fileNames.length > 0) {
                generateTestCase(parentPath, fileNames);
            } else {
                console.log('Not found names');
            }
        }
    }
}

function isFile(name) {
    return name.includes('.');
}

async function generateTestCase(parentPath, fileNames) {
    for (const fileName of fileNames) {
        if (isFile(fileName)) {
            writeFile(parentPath, fileName);
        } else {
            const isDir = await fs.existsSync(nextParentName);

            if (isDir) {
                generateData(fileName);
            }
        }
    }
}

init();
