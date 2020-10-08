"use strict"

const fs = require('fs');
const systempath = require('path');
const formidable = require('formidable');

const dirUpload = 'upload_files';
if (!fs.existsSync(dirUpload)) fs.mkdirSync(dirUpload);

class PostHandlers {

  formProcess(req, res, next) {
    const form = new formidable.IncomingForm();
    //thư mục lưu file temp khi upload
    //nếu không có thư mục này thì sẽ file temp sẽ được chứa trong ổ C:...
    form.uploadDir = dirUpload;
    form.parse(req, (err, fields, files) => {
      let formData = { params: {}, files: {} };
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(JSON.stringify({ message: 'Parse Formdata Error', error: err }));
      } else {
        for (let key in fields) {
          Object.defineProperty(formData.params, key, {
            value: fields[key],
            enumerable: true
          });
        }

        let count_file = 0;
        for (let key in files) {
          //đường dẫn thực file upload lên
          let filenameStored = dirUpload + systempath.sep
            + files[key].size + "_"
            + files[key].name;

          //duong dan truy cap kieu web
          let urlFileName = dirUpload + "/"
            + files[key].size + "_"//thuộc tính size là kích cỡ file truyền lên sau khi định dạng lưu trữ tiết kiệm (nếu là file ảnh)
            + files[key].name;//thuộc tính name là filename truyền lên

          var oldpath = files[key].path;
          var newpath = filenameStored
          //chuyển file từ thư mục temp sang thư mục upload_files
          try {
            fs.rename(oldpath, newpath, err => { });
          } catch (err) {
          }

          count_file++;

          let contentType = 'image/jpeg';
          //xác định kiểu file upload lên
          contentType = files[key].type;
          Object.defineProperty(formData.files, key, {
            value: {
              url: urlFileName
              , file_name: files[key].name//thuộc tính name là filename truyền lên
              , file_size: files[key].size//thuộc tính size là kích cỡ file truyền lên sau khi định dạng lưu trữ tiết kiệm (nếu là file ảnh)
              , file_type: contentType
            },
            enumerable: true //cho phep gan thanh thuoc tinh truy van sau khi hoan thanh
          });
        }
        formData.params.count_file = count_file;
        req.form_data = formData;
        next();
      }
    });
  }

  jsonProcess(req, res, next) {
    let postDataString = '';
    //Nhận json_data post lên gán cho biến postDataString
    req.on('data', (chunk) => {
      //chunk có kiểu buffer
      //biến postDataString có kiểu string
      postDataString += chunk; //cách gán này chuyển chunk từ kiểu buffer sang kiểu string
      //và gán cho biến postDataString
    });
    req.on('end', () => {
      try {
        //chuyển postDataString từ kiểu string thành dạng json
        req.json_data = JSON.parse(postDataString);
        next();
      } catch (err) {
        res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(JSON.stringify({ message: "Lỗi chuyển đổi từ string sang json!", error: err }));
      }
    })
  }

}
module.exports = new PostHandlers();