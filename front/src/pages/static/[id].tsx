import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ObjectId } from "mongodb";


type ContactIdsResponse = {
    _id: string
  }
  
  type Evento = {
    _id : ObjectId,
    titulo : string,
    descripcion? : string
    fecha : Date 
    horadeinicio : number
    horadefinal : number
    invitados : string[]
  }
 
export const getStaticPaths: GetStaticPaths = async () => {
    const contactIdResponse = await fetch("http://localhost:8080/events");
    const contactIdsData: ContactIdsResponse[] = await contactIdResponse.json();

    const data2 = contactIdsData.map((e)=> {
      console.log(e._id)
      return e._id.toString()
    })

    const paths = data2.map((id ) => ({
      params: { id },
    }));
  
    return {
      paths,
      fallback: false,
    };
  }

 
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id

  const contactDataResponse = await fetch(`http://localhost:8080/event/${id}`);
  const contactData: Evento = await contactDataResponse.json();

  return {
    props: {
      ID : id,
      data: contactData,
    },
  };
}


const Index: NextPage<{data : Evento}> = ({ data }) => {

  return (
    <>
      <h1>DATOS</h1>
      {data._id}
      {
        data.titulo
      }
    </>
  );
}

export default Index;