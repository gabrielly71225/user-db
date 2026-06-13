import "dotenv/config"
import express from "express";
import mysql from "mysql2/promise";

const port = 3000;
const app  = express();
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE ,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
 

// C
app.post("/users", async (req, res) => {
   try{
        const nome = req.body.nome;
        const email = req.body.email;
        const cpf = req.body.cpf;
        const apelido = req.body.apelido ?? null;

        console.log(nome, email, cpf, apelido);

        const result = await pool.query(
            "INSERT INTO user (nome, email, cpf, apelido) VALUES(?,?,?,?);",
            [nome, email, cpf, apelido]
        );
        res.status(201).json({msg: "usuario criado com sucesso"});
   }
   catch(error){
        console.error(error);
        res.status(500).json({msg: "Erro ao criar usuário"})
   }
})

// R
app.get("/users", async (req, res) =>{
    try{
        const rows = await pool.query("SELECT * FROM  user;");
        res.status(200).json(rows[0]);
    }
    catch(erro){
        console.error(erro);
        res.status(500).json({msg: "Erro ao listar usuários"})
    }
 });


//u
 app.put("/users/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const nome = req.body.nome;
        const email = req.body.email;
        const cpf = req.body.cpf;
        const apelido = req.body.apelido ?? null;
    
        const rows = await pool.query(
            " UPDATE user SET nome = ?, email = ?, cpf = ?, apelido = ? WHERE id = ?;",
            [nome, email, cpf, apelido, id]
        );

        res.status(200).json({msg: "usuario atualizado com sucesso"});
    }
     catch(error){
        console.error(error);
        res.status(500).json({msg: "Houve um erro... entre em contato com o Admnistrador"})
    }
 })

// D
 app.delete("/users/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const rows = await pool.query("DELETE FROM user WHERE id = ?;",
        [id]);
        if(rows[0].affectedRows == 0){
            throw new Error("Erro ao deletar usuário!")
        }

        res.status(200).json({msg: "usuario apagado com sucesso"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({msg: "Erro ao deletar usuario"})
    }  
 });

 
 
app.listen(port, () => {
    console.log("servidor rodando na porta" + port);
})