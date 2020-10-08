
class Handler {
    testPostJson(req, res) {
        console.log(req.json_data);
    }

    testPostFile(req, res) {
        console.log(req.form_data);
    }
}

module.exports = new Handler()