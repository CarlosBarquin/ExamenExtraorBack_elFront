
import Link from "next/link";
import { FC, use, useEffect, useState } from "react";
import { ObjectId } from 'mongodb';


type Evento = {
    _id : ObjectId,
    titulo : string,
    descripcion? : string
    fecha : Date 
    horadeinicio : number
    horadefinal : number
    invitados : string[]
  }

const pagina = () => {

    const [events, setEvents] = useState<Evento[] | undefined>([])

    const [name , setName]=  useState<string>("")
    const [description , setDescription]=  useState<string>()
    const [date , setDate]=  useState<Date>()
    const [startHour , setStartHour]=  useState<number>(0)
    const [endHour , setEndHour]=  useState<number>(0)
    const [invitados , setInvitados]=  useState<string[]>([])

    const [name2 , setName2]=  useState<string>("")
    const [description2 , setDescription2]=  useState<string>()
    const [date2 , setDate2]=  useState<Date>()
    const [startHour2 , setStartHour2]=  useState<number>(0)
    const [endHour2 , setEndHour2]=  useState<number>(0)
    const [invitados2 , setInvitados2]=  useState<string[]>([])

    const [cambia , setCambia] = useState<number>(0)
    const [cambia2 , setCambia2] = useState<number>(0)

    const [id, setId] = useState<string>("")
    const [id2, setId2] = useState<string>("")

    const [ids , setIds] =  useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {

          const lines = await fetch(`http://localhost:8080/events`);
          const json : Evento[] | undefined = await lines.json();
          setEvents(json);
          console.log(json);
          
        };
        try {
          fetchData();
        } catch (e) {
          console.log(e);
        }
      }, [cambia])
    

    const handleSubmit = async ( ) => {
        let month = ""
        let day = ""
        if((date!.getMonth() + 1) < 10){
            month = "0" + (date!.getMonth() + 1).toString() 
        }else{
            month = (date!.getMonth() + 1).toString()
        }

        if(date!.getDate() < 10){
            day = "0" + (date!.getDate()).toString() 
        }else{
            day = (date!.getDate()).toString()
        }

        const Date = date?.getFullYear().toString() + "-" + month + "-" + day

        try {
          await fetch("http://localhost:8080/addEvent", {
            method: "POST",
            headers: {
              'content-type': 'application/json'
      
            },
            body: JSON.stringify({titulo : name, descripcion : description, fecha : Date, inicio : startHour, fin : endHour, invitados}),
            mode : "no-cors"
          });
          
          setCambia(cambia+1)
        } catch (error) {
          const errorMessage = error as string
          const errorMessageElement = document.getElementById('error-message');
          errorMessageElement!.textContent = errorMessage; 
        }
    
      };
    ;

    const PUTSubmit = async ( ) => {
        let month = ""
        let day = ""
        if((date2!.getMonth() + 1) < 10){
            month = "0" + (date2!.getMonth() + 1).toString() 
        }else{
            month = (date2!.getMonth() + 1).toString()
        }

        if(date2!.getDate() < 10){
            day = "0" + (date2!.getDate()).toString() 
        }else{
            day = (date2!.getDate()).toString()
        }

        const Date = date2?.getFullYear().toString() + "-" + month + "-" + day
        try {
          await fetch("http://localhost:8080/updateEvent", {
            method: "PUT",
            body: JSON.stringify({ id : id2 , titulo : name2, descripcion : description2, fecha : Date, inicio : startHour2, fin : endHour2, invitados : invitados2}),
          });
          
          setCambia(cambia+1)
        } catch (error) {
         alert(error)
        }
    
      };

      useEffect(()=> {
        if (id2 === "" ) return
        PUTSubmit()
      },[cambia2])

    const deleteSubmit = async () => {
        try {
          await fetch(`http://localhost:8080/deleteEvent/${id} `, {
            method: "DELETE",
          });
          
          setCambia(cambia-1)
        } catch (error) {
          const errorMessage = error as string
          const errorMessageElement = document.getElementById('error-message');
          errorMessageElement!.textContent = errorMessage; 
        }
    
      };

      useEffect(()=> {
        if(id === "") return 
        deleteSubmit()
      },[id])
    
    
      return (
          <>
            <div></div>
          <h1>CREAR EVENT</h1>
          <input type="datetime-local" placeholder="date" onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setDate(newDate);
        }} />
          <input type="text" placeholder="name" onChange={(e)=> setName(e.target.value)}></input>
          <input type="text" placeholder="description" onChange={(e)=>  setDescription(e.target.value)}></input>
          <input type="text" placeholder="inicio" onChange={(e)=> setStartHour(parseInt(e.target.value))}></input>
          <input type="text" placeholder="fin" onChange={(e)=> setEndHour(parseInt(e.target.value))}></input>
          <input type="text" placeholder="invitados" onChange={(e)=> {
                const invitados = e.target.value.split(",");
                setInvitados(invitados);
          }}></input>
        
          <button onClick={()=> { handleSubmit() }}>add</button>
           
          <h1>eventos</h1>
          {events?.map((e)=> {
            return(
                <>
                    {<Link href={`/static/${e._id.toString()}`}>{e.titulo}</Link>}--
                    {new Date(e.fecha).toLocaleDateString()}--
                    {e.descripcion}--
                    {e.horadeinicio}--
                    {e.horadefinal}--
                    <button
                    onClick={()=> {
                        setId(e._id.toString())
                    }}
                    >borrar</button>--
                    <button onClick={()=> {
                           if(ids.includes(e._id.toString())){
                            setIds(ids.filter((id)=> id !== e._id.toString()))
                          }else{
                            setIds([...ids, e._id.toString()])
                          } 
                    }}>editar</button>--
                    invitados: 
                    {e.invitados.map((i)=> {
                        return(
                            <>
                                <li>{i}</li>
                            </>
                        )
                    })}

                    {ids.includes(e._id.toString())  && (
                        <>
    <input type="datetime-local" placeholder="date" onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setDate2(newDate);
        }} />
          <input type="text" placeholder="name" onChange={(e)=> setName2(e.target.value)}></input>
          <input type="text" placeholder="description" onChange={(e)=>  setDescription2(e.target.value)}></input>
          <input type="text" placeholder="inicio" onChange={(e)=> setStartHour2(parseInt(e.target.value))}></input>
          <input type="text" placeholder="fin" onChange={(e)=> setEndHour2(parseInt(e.target.value))}></input>
          <input type="text" placeholder="invitados" onChange={(e)=> {
                const invitados = e.target.value.split(",");
                setInvitados2(invitados);
          }}></input>
        
          <button onClick={()=> { setId2(e._id.toString())  
            setCambia2(cambia2+1)
        }}>add</button>
                        </>
                    )}
                </>
            )
          })}
     
             
          
          </>
      )
  }


  export default pagina