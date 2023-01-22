require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;
mongoose.connect(process.env.CONNECT_MONGOOSE).then(() => {
    const server = app.listen(port, () => {
        console.log("Server Running... on port " + port);
    })
    
    process.on("uncaughtException", err => {
        console.log(err.name, err.message)
        server.close(() => {
            process.exit(1)
        })
    })
})
