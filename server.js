require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;
mongoose.set('strictQuery', false);

if(process.env.NODE_ENV === "development"){
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
}else{
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
    const mongooseConnect = process.env.CONNECT_CLOUD.replace(/<password>/, () =>  process.env.PASSKEY);
    

    mongoose.connect(mongooseConnect, connectionParams)
        .then( () => {
            console.log('Connected to the database ')
        })
        .catch( (err) => {
            console.error(`Error connecting to the database. n${err}`)
        })

        app.listen(port, () => {
            console.log("Server Running... on port " + port)
    })

    process.on("uncaughtException", err => {
        console.log(err.name, err.message)
        server.close(() => {
            process.exit(1)
        })
    })
}
