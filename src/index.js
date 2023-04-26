require('dotenv').config();

const path = require('path');

const { TEST_CONTEXT_FILE, SOURCE_INDEX, TEST_DIR_NAME, SCAN_DIR_NAME } = process.env;

exports.TEST_CONTEXT_PATH = path.join(__dirname, `./template/${TEST_CONTEXT_FILE}`);
exports.FULL_PATH = path.resolve(__dirname, '../', SOURCE_INDEX);
exports.TEST_DIR_NAME = TEST_DIR_NAME;
exports.TEST_TO_BE_PATH = path.resolve(__dirname, './template', 'toBe.txt');
exports.TEST_TO_EXPECT_PATH = path.resolve(__dirname, './template', 'expect.txt');
exports.SCAN_DIR_NAME = SCAN_DIR_NAME;
exports.isFile = (name) =>  name && name.includes('.')