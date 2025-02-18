const data = require('./apiresponse.json');

data.data.forEach((e, index) => {
    e.Location = 'location ' + index;
    e.Content = 'content ' + index;
    e.documentId = 'documentId-' + index;
    e.id = 'id-' + index;
});

require('fs').writeFileSync('out.json', JSON.stringify(data));
