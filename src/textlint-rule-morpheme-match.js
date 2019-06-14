"use strict";
import { createTextlintMatcher } from "morpheme-match-textlint";

const tokenize = require("kuromojin").tokenize;
const path = require("path");
const untildify = require("untildify");

/**
 * Replace text with tokens
 * @param text
 * @param tokens
 * @param actualTokens
 * @returns {*}
 */
const replaceWithCaptureTokens = (text, tokens, actualTokens) => {
    let resultText = text;
    tokens.forEach((token, index) => {
        // when the node has not `_capture_`, does not replace it
        if (!token._capture) {
            return;
        }
        const actualToken = actualTokens[index];
        resultText = resultText.replace(token._capture, actualToken.surface_form);
    });
    return resultText;
};

const flat = (array) => {
    return array.reduce((total, item) => total.concat(item), []);
};
/**
 * load dictionary file(.js or .json) and return it
 * @param {string} baseDirectory base directory
 * @param {string} dictionaryFilePath .js or .json path list
 */
const loadDictionary = (baseDirectory, dictionaryFilePath) => {
    const untildifiedFilePath = untildify(dictionaryFilePath);
    try {
        const absoluteFilePath = path.resolve(baseDirectory, untildifiedFilePath);
        return require(absoluteFilePath);
    } catch (error) {
        throw new Error(`Can not load ${dictionaryFilePath}: ${error}`);
    }
};

/**
 * load dictionary file(.js or .json) and return it
 * @param {string} baseDirectory base directory
 * @param {string[]} dictionaryFilePathList dictionary file list
 */
const loadDictionaries = (baseDirectory, dictionaryFilePathList) => {
    const contents = dictionaryFilePathList.map(filePath => loadDictionary(baseDirectory, filePath));
    return flat(contents);
};

/**
 * @param context
 * @param {{dictionaryPathList:string[]}} options
 * @returns {*}
 */
const reporter = (context, options) => {
    const { Syntax, RuleError, report, fixer, getSource } = context;
    if (!options.dictionaryPathList) {
        throw new Error(`You should set "dictionaryPathList" options.
{ 
    dictionaryPathList: ["./path/to/dictionary.js", "./path/to/dictionary.json"]
}        
`);
    }

    if (!Array.isArray(options.dictionaryPathList)) {
        throw new Error(`"dictionaryPathList" option should be array.
{ 
    dictionaryPathList: ["./path/to/dictionary.js", "./path/to/dictionary.json"]
}        
`);
    }

    const textlintRcDir = context.getConfigBaseDir() || process.cwd();
    const dictionaryList = loadDictionaries(textlintRcDir, options.dictionaryPathList);
    const matchAll = createTextlintMatcher({
        tokenize: tokenize,
        dictionaries: dictionaryList
    });
    return {
        [Syntax.Str](node) {
            const text = getSource(node);
            return matchAll(text).then(results => {
                results.forEach(result => {
                    if (result.expected) {
                        report(node, new RuleError(result.message, {
                            index: result.index,
                            fix: fixer.replaceTextRange(result.range, result.expected)
                        }));
                    } else {
                        report(node, new RuleError(result.message, {
                            index: result.index
                        }));
                    }

                });
            });
        }
    };
};
module.exports = {
    linter: reporter,
    fixer: reporter
};
