const router = require('express').Router();

const postHandler = require('../utils/post-handler');
const handlers = require('../handlers/handler');

router.post('/test-post-json'
    , postHandler.jsonProcess
    , handlers.testPostJson
);

router.post('/test-post-file'
    , postHandler.formProcess
    , handlers.testPostFile
);

module.exports = router;