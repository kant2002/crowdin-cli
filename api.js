/*jslint node: true*/
'use strict';

var https = require('https'),
    request = require('request'),
    apiKey,
    baseUrl = 'https://api.crowdin.com';

function validateKey() {
    if (apiKey === undefined) {
        throw new Error("Please specify CrowdIn API key.");
    }
}

function doApiCall(method, apiUrl, callback) {
    var options,
        requestCallback;
    validateKey();

    requestCallback = function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            callback(JSON.parse(str));
        });
    };

    options = {
        host: 'api.crowdin.com',
        path: '/api/' + apiUrl + '?json=true&key=' + apiKey,
        method: method
    };
    https.request(options, requestCallback).end();
}

function getApiCall(apiUrl, callback) {
    validateKey();
    var url = baseUrl + '/api/' + apiUrl + '?json=true&key=' + apiKey;
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
    var url = baseUrl + '/api/' + apiUrl + '?key=' + apiKey;
    return request(url);
}

module.exports = {
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
    }
};
