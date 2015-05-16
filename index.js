/*jslint node:true*/
'use strict';

var api = require('./api'),
    YAML = require('yamljs'),
    fs = require('fs'),
    configFileName = 'crowdin.yaml';

if (!fs.existsSync(configFileName)) {
    console.log("Configuration file is missing.");
    process.exit(1);
}

var content = fs.readFileSync(configFileName, 'utf8'),
    config = YAML.parse(content),
    base_path = config.base_path || '.';

if (config.api_key === undefined) {
    console.log("API key is missing.");
    process.exit(1);
}

if (config.base_url !== undefined) {
    api.setKey(config.base_url);
}

api.setKey(config.api_key);
var handleTestResult = function (err, data) {
    if (err) {
        throw err;
    }

    console.log(data);
};
/*api.projectInfo(config.project_identifier, handleTestResult);*/
/*api.supportedLanguages();*/
//api.downloadTranslations(config.project_identifier, 'es').pipe(fs.createWriteStream('es.zip'));
//api.downloadAllTranslations(config.project_identifier).pipe(fs.createWriteStream('all.zip'));
api.downloadTranslationMemory(config.project_identifier).pipe(fs.createWriteStream('cordova.tmx'));

module.exports = api;
