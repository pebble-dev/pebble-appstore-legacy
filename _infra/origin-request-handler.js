const parser = require('./accept-language-parser');

const languages = {
    'en-US': 'en_US',
    'fr-FR': 'fr_FR',
    'de-DE': 'de_DE',
    'es-ES': 'es_ES',
    'nl-NL': 'nl_NL',
    'pl-PL': 'pl_PL',
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_TW',
};

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    let uri = request.uri;
    
    if (uri === '/') {
        const headers = request.headers;
        let lang = 'en-US';
        if (headers['accept-language']) {
            lang = parser.pick(Object.keys(languages), headers['accept-language'][0]['value'], {loose: true});
        }
        const destination = `/${languages[lang]}/`;
        callback(null, {
            status: '302',
            statusDescription: 'Moved',
            headers: {
                'location': [{
                    key: 'Location',
                    value: destination,
                }],
                'vary': [{
                    key: 'Vary',
                    value: 'Accept-Language',
                }],
            },
            body: `<a href="${destination}">Go to ${lang}.</a>`,
        });
        return;
    }
    
    const parts = uri.split('/');
    let lang = "en_US";
    if (parts[1].indexOf('_') !== -1) {
        lang = parts.splice(1, 1)[0];
    }
    uri = parts.join('/');
    request.uri = uri;
    if (!uri.startsWith('/images/') && !uri.startsWith('/fonts/') && !uri.startsWith('/placeholders/')) {
        request.uri = `/${lang}.html`;
    }
    callback(null, request);
};
