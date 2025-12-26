import { Webhook } from "svix";

import User from "../models/User.js";


// API Controller Function to manage Clerk User with database 

export const clerkWebhooks = async (req , res) =>{
    try{

        //create a svix instance with clerk webhook secret
        const whook = new Webhook (process.env.CLERK_WEBHOOK_SECRET)



        //verifying headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"]

        }) 

        //Getting cases for different Events

        const {data , type} = req.body



        // Switch Cases for different Evenets 

        switch (type) {
            case 'user.created':{
 
                const userData = {
                    _id:Data.

                }

                
            }
                

            case 'user.updated':{
                
            }



            case 'user.deleted':{
                
            }

            default : 
            break;
          
        }



    }

    catch(error){

    }
}