require("dotenv").config({path: "./config.env"});
const app = require("./app");
const mongoose = require("mongoose");



const port = process.env.PORT || 3000;
mongoose.connect(process.env.CONNECT_MONGOOSE).then(() => {
    app.listen(port, () => {
        console.log("Server instance successful... on port " + port);
    })
    
})
