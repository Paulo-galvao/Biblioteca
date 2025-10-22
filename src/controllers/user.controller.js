import pool from "../database/db.js";

export async function index(req, res) {
    try {
        const users = await pool.query("SELECT * FROM users");

        if(users.rows.length === 0) {
            res.status(404).json({
                message: "Nenhum usuário localizado"
            })
        }

        res.status(200).json(users.rows);
    } catch (error) {
        console.log(error.message);
        
    }
}

export async function store(req, res) {
    try {
        const {nome} = req.body;

        if(!nome) {
            res.status(400).json({
                message: "Não esqueça de informar todos os campos"
            })
        }

        await pool.query(`
            INSERT INTO users(nome) VALUES($1)    
        `, [nome]);

        res.status(201).json({
            message: "Novo usuário cadastrado com sucesso"
        });
    } catch (error) {
        console.log(error.message);
    }
}