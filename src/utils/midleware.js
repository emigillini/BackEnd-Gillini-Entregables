import multer from "multer";

export const logRequest = (req, res, next) => {
  console.log(`Request recibida: ${new Date()}`);
  next();
};
export const msg = (req, res, next) => {
  console.log("gracias por consultar");
  next();
};
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload =multer({storage:storage})