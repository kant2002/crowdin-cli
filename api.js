/*jslint node: true*/
'use strict';

var https = require('https'),
    request = require('request'),
    apiKey,
    baseUrl = 'https://api.crowdin.com',
    verbose = 0;

function validateKey() {
    if (apiKey === undefined) {
        throw new Error("Please specify CrowdIn API key.");
    }
}

function getApiCall(apiUrl, callback) {
    validateKey();
    var url = baseUrl + '/api/' + apiUrl + '?json=true&key=' + apiKey;
    if (verbose > 0) {
        console.log("Doing GET request:");
        console.log(url);
    }

    return request.get(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(null, JSON.parse(body));
        } else {
            callback(error);
        }
    });
}

function postApiCall(apiUrl, callback) {
    validateKey();
    var url = baseUrl + '/api/' + apiUrl + '?json=true&key=' + apiKey;
    if (verbose > 0) {
        console.log("Doing POST request:");
        console.log(url);
    }

    return request.post(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(null, JSON.parse(body));
        } else {
            callback(error);
        }
    });
}

function getApiRequest(apiUrl, callback) {
    validateKey();
    var url = baseUrl + '/api/' + apiUrl + '?key=' + apiKey + '&json';
    if (verbose > 0) {
        console.log("Doing request:");
        console.log(url);
    }

    return request(url);
}

module.exports = {
    setVerbose: function (newValue) {
        verbose = newValue;
    },
    setBasePath: function (newBasePath) {
        baseUrl = newBasePath;
    },
    setKey: function (newKey) {
        apiKey = newKey;
    },
    translationStatus: function (projectName, callback) {
        postApiCall('project/' + projectName + '/status', callback);
    },
    projectInfo: function (projectName, callback) {
        postApiCall('project/' + projectName + '/info', callback);
    },
    /**
    * Download ZIP file with translations. You can choose the language of translation you need.
    */
    downloadTranslations: function (projectName, languageCode) {
        return getApiRequest('project/' + projectName + '/download/' + languageCode + '.zip');
    },
    /**
    * Download ZIP file with all translations.
    */
    downloadAllTranslations: function (projectName) {
        return getApiRequest('project/' + projectName + '/download/all.zip');
    },
    supportedLanguages: function (callback) {
        getApiCall('supported-languages', callback);
    },
    /**
    * Build ZIP archive with the latest translations. Please note that this method can be invoked only once per 30 minutes (there is no such
    * restriction for organization plans). Also API call will be ignored if there were no changes in the project since previous export. 
    * You can see whether ZIP archive with latest translations was actually build by status attribute ("built" or "skipped") returned in response.
    */
    exportTranslations: function (projectName, callback) {
        getApiCall('project/' + projectName + '/export', callback);
    },
    /**
    * Download Crowdin project glossaries as TBX file.
    */
    downloadGlossary: function (projectName) {
        return getApiRequest('project/' + projectName + '/download-glossary');
    }
};
