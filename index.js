const express = require('express');
const app = express();
const port = 5000 || process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello Backend!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});