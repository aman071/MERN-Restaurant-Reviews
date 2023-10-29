import { MongoClient, ObjectId } from 'mongodb'

let restaurants; //a variable to store a reference to our database

export default class resDAO {
    // we connect to our database with this
    static async injectDB(conn){
        if(restaurants){    //if restaurants already has something, we're already connected
            return
        }
        try{    //else we try to connect. inside sample_restaurants are 2 collections. we want restaurants
            restaurants = await conn.db(process.env.RESETREVIEWS_NS).collection("restaurants")  //connect to database
        }
        catch(e){
            console.error(`Unable to establish connection: ${e}`)
        }
    }

    // called when we want a list of restaurants
    static async getRestaurants({
        filters=null,   //type of info wanted
        page=0,         //default page to initially show
        restaurantsPerPage=10
    } = {}){
        let query
        //3 different filters we've set up. 3 different types of searches
        if(filters){
            if("name" in filters){
                //do a text search. anywhere in our text search for the name in filter
                //$text is not a databse field, while the rest are as we can see. how will
                //the query happen? we have to set that up on mongodb atlas.
                //our url would contain a query for a name. We would need to create an index on name.
                query = {$text:{$search:filters["name"]}}
            }
            else if("cuisine" in filters){
                //says is the cuisine that we entered in filter equals
                //what we have in the database ($eq)
                query={"cuisine":{$eq:filters["cuisine"]}}
            }
            else if("zipcode" in filters){
                query = {"address.zipcode": {$eq:filters["zipcode"]}}
            }
        }

        let cursor
        try{
            cursor=await restaurants                        //restaurants is the result for db connection request.
            .find(query)
        }catch(e){
            console.error(`Unable to issue command, ${e}`)
            return {restaurantsList:[], totalNumRestaurants:0}
        }
        
        //skip allows us to the beginning of a required page
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage*page)
        try{
            const restaurantsList=await displayCursor.toArray()
            const totalNumRestaurants=await restaurants.countDocuments(query)
            return {restaurantsList, totalNumRestaurants}
        }
        catch(e){
            console.error(`Error occurred, ${e}`)
            return {restaurantsList:[], totalNumRestaurants:0}
        }
    }

    static async getRestaurantByID(id) {
        try {
            const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
                    {
                        $lookup: {
                            from: "reviews",
                            let: {
                                id: "$_id",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$restaurant_id", "$$id"],
                                        },
                                    },
                                },
                                {
                                    $sort: {
                                        date: -1,
                                    },
                                },
                            ],
                            as: "reviews",
                        },
                    },
                    {
                        $addFields: {
                            reviews: "$reviews",
                        },
                    },
                ]
            return await restaurants.aggregate(pipeline).next()
        } catch (e) {
            console.error(`Something went wrong in getRestaurantByID: ${e}`)
            throw e
        }
        }

    static async getCuisines() {
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }
}