import pool from "../database/db.js";
import bcrypt from "bcrypt";

export async function index(req, res) {
    try {
        const users = await pool.query("SELECT * FROM users");

        if(users.rows.length === 0) {
            res.status(404).json({
                error: "Nenhum usuário localizado"
            })
        }

        res.status(200).json({
            sucess: "Usuários ativos",
            data: users.rows
        });
    } catch (error) {
        res.status(500).json(error.message);
        
    }
}

export async function store(req, res) {
    try {
        const {name, password} = req.body;

        if(!name || !password) {
            res.status(400).json({
                error: "Não esqueça de informar todos os campos"
            })
        }

        const cryptPass = await bcrypt.hash(password, 10);
        
        await pool.query(`
            INSERT INTO users(name, password) VALUES($1, $2)     
        `, [name, cryptPass]);
             
        res.status(201).json({
            sucess: "Novo usuário cadastrado com sucesso"
        }
        );
        } 
    catch (error) {
        res.status(500).json(error.message);
    } 
}

export async function update(req, res) {
    try {
        const { name, password }= req.body;
        const { id } = req.params;

        if(!name || !password) {
            res.status(400).json({
                error: "Não esqueça de informar todos os campos"
            });
        }

        const cryptPass = await bcrypt.hash(password, 10);

        await pool.query(`
            UPDATE users
            SET name=$1, password=$2  
            WHERE id=$3
        `, [name, cryptPass, id]);

        res.status(200).json({
            sucess: "Usuário atualizado com sucesso"
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export async function destroy(req, res) {
    try {
        const { id } = req.params;

        await pool.query(`
            DELETE FROM users
            WHERE id=$1    
        `, [id]);

        res.status(200).json({
            sucess: "Usuário excluído com sucesso"
        });

    } catch (error) {
        res.status(500).json(error.message);
    }
}

export async function show(req, res) {
    try {
        const { id } = req.params;

        const user = await pool.query(`
            SELECT * FROM users WHERE id=$1    
        `, [id]);
            
        if(!user || id < 1) {
            return res.status(400).json({
                error: "Usuário não localizado"
            })
        }

        return res.status(200).json({
            sucess: "Usuário localizado",
            data: user.rows
        });

    } catch (error) {
        res.status(500).json(error.message)
    }
}