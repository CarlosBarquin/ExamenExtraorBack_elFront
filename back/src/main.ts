import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { addEvent } from "./resolvers/post.ts";
import { getEvent, getEvents } from "./resolvers/get.ts";
import { deleteEvent } from "./resolvers/delete.ts";
import { putEvent } from "./resolvers/put.ts";



const router = new Router();

router
.post("/addEvent" , addEvent)
.get("/event/:id" ,getEvent)
.delete("/deleteEvent/:id", deleteEvent)
.get("/events", getEvents)
.put("/updateEvent", putEvent)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: 8080 });
