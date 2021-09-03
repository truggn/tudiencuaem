const multer = require('multer')

const storage = multer.diskStorage({
    // nơi file được lưu lại 
    destination: function (req, file, callback) {
        callback(null, './upload/avata');
    },
    // 
    filename: function (req, file, callback) {
        // chi nhan nhung file image duoi jpeg va png
        let math = ["image/png", "image/jpeg"]
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        //Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
        let fileName = `${Date.now()}-trungdev-${file.originalname}`;
        callback(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1
    },
})


module.exports = upload;