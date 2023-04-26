const fs = require('fs');
const path = require('path');
const { FULL_PATH } = require('.');
const { generateTestFile } = require('./generator/gen-test-suit');
const { TEST_DIR_NAME, TEST_CONTEXT_FILE } = process.env;

function init() {
    fs.readdir(FULL_PATH, { encoding: 'utf8' }, async function (err, pathList) {
        pathList.map(async (itemPath) => {
            const fullPathTest = path.join(FULL_PATH, itemPath, TEST_DIR_NAME);
            const isFileExits = await fs.existsSync(fullPathTest);

            if (isFileExits) {
                const fileList = await fs.readdirSync(fullPathTest, {
                    recursive: true,
                });

                if (fileList && fileList.length > 0) {
                    fileList.forEach(async (fileName) => {
                        const isChange = await isTestFileChanged(itemPath, fileName, fullPathTest);

                        // destroy if un Changed file
                        if (isChange) {
                            console.log('File changed, please do not remove', fileName);
                        } else {
                            const filePath = path.resolve(
                                FULL_PATH,
                                itemPath,
                                TEST_DIR_NAME,
                                fileName,
                            );
                            await fs.unlinkSync(filePath);
                            console.log('Destroy Success ->', filePath);
                        }
                    });
                } else {
                    await fs.rmdirSync(fullPathTest, { force: true });
                }
            } else {
                console.log('Test File is Not Exits', fullPathTest);
            }
        });
    });

    console.log('Destroy end!!!');
}

async function isTestFileChanged(itemPath, fileName, fullPathTest) {
    const filePath = path.resolve(FULL_PATH, itemPath, TEST_DIR_NAME, fileName);
    const isFileExists = await fs.existsSync(filePath);

    if (!isFileExists) {
        return 0;
    } else {
        const fileContext = (await fs.readFileSync(filePath)).toString();
        const baseTestContext = await generateTestFile(fullPathTest, fileName);

        return Number(fileContext !== baseTestContext);
    }
}

init();
