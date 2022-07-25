const multer = require('multer');
const uuid = require('uuid').v4;

const storage = multer.diskStorage(
{
    destination(req, file, cd)  {
        cd(null, 'tests')
    },

    filename(req, file, cd) 
    {
        cd(null, uuid()+'.txt');
    }

    
});



const allowedTypes = ['text/plain'];

const fileFilter = (req, file, cb) => 
{
   
    if (allowedTypes.includes(file.mimetype))
    {
        cb(null, true);
    }
    else 
    {
        cb(null, false);
    }


    
}

module.exports = multer(
{
    
    storage,
    fileFilter,
    limits: {
        fileSize: 1048576
    } 

})