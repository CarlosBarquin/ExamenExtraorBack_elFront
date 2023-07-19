import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { eventCollection } from "../db/mongo.ts";


type getEventsContext = RouterContext<"/events", Record<string | number, string | undefined>, Record<string, any>>

type getEventContext = RouterContext<"/event/:id", {
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>

export const getEvent = async (context : getEventContext) => {
    try {
        const id = context.params.id

        if(!id){
            context.response.status = 400
            return
        }

        const evento = await eventCollection.findOne({_id : new ObjectId(id)})

        if(!evento){
            context.response.status = 404
            return
        }

        context.response.body = evento
        context.response.status = 200

        
    } catch (e) {
        context.response.body = e
    }
}



export const getEvents = async (context : getEventsContext) => {
    try {

        const DATE = new Date()


        const Events = await eventCollection.find({fecha : {$gte : DATE}}).toArray()

        context.response.body = Events

        context.response.status = 200

        
    } catch (e) {
        context.response.body = e
    }
}


