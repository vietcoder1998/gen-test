require('dotenv').config()
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const { TEST_CONTEXT_PATH } = require('..');

const { DATA_SOURCE, TEST_CONTEXT_FILE } = process.env;
const sourcePath = path.resolve(`./data/${DATA_SOURCE}`);

exports.common = function () {
    var csvData = [];
    fs.createReadStream(sourcePath)
        .pipe(csv.parse({ headers: false }))
        .on('data', function (csvrow) {
            csvData.push(csvrow);
        })
        .on('end', function () {
            //do something with csvData
        });
    console.log(csvData);
};

exports.generateTestFile = async function(testFile) {
    const testContext = (await fs.readFileSync(TEST_CONTEXT_PATH, { encoding: 'utf-8' })).toString();
    return testContext.replaceAll(/{{testFile}}/g, testFile);
}
