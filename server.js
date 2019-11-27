
const express = require('express');
const db = require('./db');

// const mysql = require('mysql2');

// const pool = mysql.createPool(
//   {
//   host:'localhost',
//   user:'root',
//   password:"root",
//   database:"sgt_m4_1019",
//   // port:3306   // by default
// }
// )

// const db = pool.promise();

const app = express();

app.use(express.json());

app.get('/api/students',async(req,res)=>{
  const [ result ] = await db.query(`select * from grades`)
  res.send({
    message:"this will contain students",
    student:result
  })
})

app.get('/api/students/:id',async(req,res)=>{

  const [ result ] = await db.query(`select name,course,grade from grades where id = ${req.params.id}`)
  res.send({
    message:`this will contain ${req.param.id} students`,
    student:result
  })
})

app.delete('/api/students/:id',async(req,res)=>{

  const result = await db.query(`delete from grades where id = ${req.params.id}`)
  res.send({
    message:`student of id:  ${req.params.id} deleted`,
    student:result
  })
})

// app.put('/api/students/:id',async(req,res)=>{

//   const result = await db.query(`update from grades set name = '${}'  where id = ${req.params.id}`)
//   res.send({
//     message:`student of id:  ${req.param.id} deleted`,
//     student:result
//   })
// })



app.post(`/api/students`, async (req,res) => {   

  try{
   
    const {name,course,grade} = req.body;
    console.log("name",name);

    const error = [];
    if(!name){
      error.push ('No student name received')
    }
    if(!grade){
      error.push ('No student grade received')
    }else if(isNaN(grade)){
      error.push("Student grade must be a number")
    }else if(grade < 0 || grade > 100){
      error.push("Student grade must be from 0 up to 100")
    }
    if(!course){
      error.push ('No student course received')
    }

    if(error.length){
      res.status(422).send({"errors":error})
      return;
    }

    const [result]  = await db.execute(`INSERT INTO grades (name, grade, course) VALUES (?,?,?)`,[name,grade,course]);

    // const [result]  = await db.query(`INSERT INTO grades (name, grade, course) VALUES 
    //                               ('${name}','${grade}','${course}')`);

    res.send({
      "message": `${name} has been at too student list`,
      student:{
        id: result.insertId,
        name,
        grade,
        course
      }
    });
      
    }catch(error){
      console.log(`Error : ${error}`);
    }
      
})



const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`Server listen on port ${port}`));




