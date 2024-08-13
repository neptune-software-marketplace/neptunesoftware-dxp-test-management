jQuery.sap.require('sap.m.MessageBox');
jQuery.sap.require('jquery.sap.storage');

// common jQuery funcs
function serializeDataForQueryString(data) {
    return jQuery.param(data);
}

function request(opts) {
    if (typeof opts.url === undefined) throw new Error('request: no url provided for the request');
    return jQuery.ajax(Object.assign({}, opts));
}

function jsonRequest(opts) {
    return request(
        Object.assign({}, {
            type: 'POST',
            contentType: 'application/json',
        }, opts)
    );
}

function sapLoadLanguage(lang) {
    return jQuery.sap.loadResource(`sap/ui/core/cldr/${lang}.json`, {
        'async': true,
        dataType: 'json',
        failOnError: true,
    });
}

function sapStorageGet(k) {
    return jQuery.sap.storage(jQuery.sap.storage.Type.local).get(k);
}

function sapStoragePut(k, v) {
    return jQuery.sap.storage(jQuery.sap.storage.Type.local).put(k, v);
}