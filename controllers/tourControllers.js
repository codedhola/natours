const fs = require("fs");
const fileData = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`, "utf-8"));

const getAllTours = (req, res) => {
    const data = fileData;
    console.log(req.timer);
    console.log(req.urlLink)
    res.status(200).json({
        "status" : "success",
        "length" : data.length,
        "data" : data 
    });
};

const createTour = (req, res) => {
    const getTours = req.body;
    const allData = fileData;

    // TOURS TO ADD 
    const id = allData.length;
    tour = {id, ...getTours};

    allData.push(tour);
    fs.writeFile(`./dev-data/data/tours-simple.json`, JSON.stringify(allData), (error) => {
        if(error) throw error;
    });
    
    res.send(tour); 
};

const getTourById = (req, res) => {
    const param = req.params;
    const tour = fileData.find(el => el.id == param.id);
    //  TOUR RECEIVES A PARTICULAR ID TOUR
    if(!tour){
        return res.status(404).send({
            status: "unsuccessful",
            message: "couldn't find the tour with the given id"
        })
    }
    res.status(200).send({
        status: "success",
        data: {
            tour
        }
    });
}

const editTour = (req, res) => {
    const param = req.params;
    const tour = fileData.find(el => el.id == param.id);

    if(!tour){
        return res.status(404).send({
            status: "unsuccessful",
            message: "Couldn't Find the tour to edit"
        })
    }
    res.send("EDITING");
};

const deleteTour = (req, res) => {
    const param = req.params;
    const tour = fileData.find(el => el.id == param.id);

    if(!tour){
        return res.status(404).send({
            status: "unsuccessful",
            message: "Couldn't Find the tour to delete"
        })
    }
    res.send("DELETING");
};


module.exports = {
    getAllTours,
    createTour,
    getTourById,
    editTour,
    deleteTour
}