import multer from 'multer';

const storage = multer.memoryStorage(); // Using memory storage to handle data buffers directly

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;
