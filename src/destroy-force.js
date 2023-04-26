const fs = require('fs');
const path = require('path');
const { FULL_PATH, isFile } = require('.');
const { TEST_DIR_NAME } = process.env;

async function destroyForce(parentName) {
    const genPath = path.join(FULL_PATH, parentName);
    const pathDirList = await fs.readdirSync(genPath);

    for (const itemPath of pathDirList) {
        const testDir = path.resolve(FULL_PATH, parentName, itemPath, TEST_DIR_NAME);
        const isTestDir = await fs.existsSync(testDir);

        if (isTestDir) {
            await fs.rmdirSync(testDir, { force: true, recursive: true });
        }
        
        if (!isFile(itemPath)) {
            const nextParent = path.join(parentName, itemPath);
            destroyForce(nextParent);
        } else {
            if (itemPath.includes('.test')) {
                await fs.unlinkSync(path.resolve(FULL_PATH, parentName, itemPath))
            }
        }
    }

    console.log('Destroy end!!!');
}

destroyForce('modules');
