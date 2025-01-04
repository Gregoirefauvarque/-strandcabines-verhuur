const express = require('express');
const multer = require('multer');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();
const port = 3000;

// Configure CORS
app.use(cors());

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Load AWS credentials
AWS.config.loadFromPath('./config.json');

const s3 = new AWS.S3();

// Endpoint to handle file uploads
app.post('/upload', upload.single('idCard'), (req, res) => {
    const file = req.file;
    const params = {
        Bucket: 'YOUR_BUCKET_NAME',
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send(err);
        }
        res.json({ file: data });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
