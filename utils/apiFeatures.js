class APIFeatures {
    constructor(Query, QueryString){
        this.Query = Query;
        this.QueryString = QueryString;
    }

    Filter(){
        const queryObj = {...this.QueryString};
        let excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.forEach(el => delete queryObj[el])

        // PARSE AND REPLACE QUERY FOR SEARCH IN DATABASE
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, arg => `$${arg}`) //CORRESPOND QUERY TO MONGODB

        console.log(queryStr)
        // SEARCH OR QUERY(IF FOUND) IN DATABASE
        this.Query = this.Query.find(JSON.parse(queryStr))
        return this;
    }

    Sort(){
        if(this.QueryString.sort){
            const sortby = this.QueryString.sort.split(",").join(" ")
            this.Query = this.Query.sort(sortby)
        }else {
            this.Query = this.Query.sort("-createdAt")
        }
        return this;
    }

    Fields(){
        if(this.QueryString.fields){
            let fields = this.QueryString.fields.split(",").join(" ")
            this.Query = this.Query.select(fields);
        }else {
            this.Query = this.Query.select("-__v")
        }
        return this;
    }

    Pagination(){
        const page = (this.QueryString.page * 1) || 1;
        const limit = (this.QueryString.limit * 1) || 10;
        const skip = (page - 1) * limit;

        // IMPLEMENTING PAGINATION
        this.Query = this.Query.skip(skip).limit(limit);

        return this;
    }
    
}

module.exports = APIFeatures;