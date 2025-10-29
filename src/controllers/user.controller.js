import pool from "../database/db.js";
import bcrypt from "bcrypt";
import generateToken from "../services/generate.token.js";

export async function index(req, res) {
    try {
        const users = await pool.query("SELECT * FROM biblioteca.users ORDER BY id");

        if(users.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Nenhum usuário localizado"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Usuários encontrados",
            data: users.rows
        });
    } catch (error) {
        return res.status(500).json(error.message);
        
    }
}

export async function store(req, res) {
    try {
        const {name, username, password} = req.body;

        if(!name || !username || !password ) {
            return res.status(400).json({
                success: false,
                message: "Não esqueça de informar todos os campos"
            })
        }

        const cryptPass = await bcrypt.hash(password, 10);
        
        const user = await pool.query(`
            INSERT INTO biblioteca.users(name, username, password) VALUES($1, $2, $3)     
        `, [name, username, cryptPass]);

        if(user.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "Não foi possivel cadastrar um novo usuário"
            });
        }
             
        return res.status(201).json({
            sucess: true, 
            message: "Novo usuário cadastrado com sucesso",
        });
    } catch (error) {
        return res.status(500).json(error.message);
    } 
}

export async function update(req, res) {
    try {
        const { name, username, password }= req.body;
        const { id } = req.params;
        const logged_id = req.userID;

        if(id != logged_id) {
            return res.status(403).json({
                success: false,
                message: "Somente o dono da conta pode alterar suas informações ou excluir conta"
            })
        }

        if(!name || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "Não esqueça de informar todos os campos"
            });
        }

        const cryptPass = await bcrypt.hash(password, 10);

        await pool.query(`
            UPDATE biblioteca.users
            SET name=$1, username=$2 password=$3  
            WHERE id=$4
        `, [name, username, cryptPass, id]);

        return res.status(200).json({
            success: true,
            message: "Usuário atualizado com sucesso"
        })
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function destroy(req, res) {
    try {
        const { id } = req.params;
        const logged_id = req.userID;

        if(id != logged_id) {
            return res.status(403).json({
                success: false,
                message: "Somente o dono da conta pode alterar suas informações ou excluir conta"
            })
        }

        await pool.query(`
            DELETE FROM biblioteca.users
            WHERE id=$1    
        `, [id]);

        return res.status(200).json({
            sucess: true,
            message: "Usuário excluído com sucesso"
        });

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function show(req, res) {
    try {
        const { id } = req.params;

        const user = await pool.query(`
            SELECT * FROM biblioteca.users WHERE id=$1    
        `, [id]);
            
        if(!user || id < 1) {
            return res.status(400).json({
                success: false,
                message: "Usuário não localizado"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Usuário localizado",
            data: user.rows
        });

    } catch (error) {
        res.status(500).json(error.message);
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        
        if(!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Não esqueça de informar todos os campos"
            });
        }
        
        const user = await pool.query(`
            SELECT * FROM biblioteca.users WHERE username=$1    
            `, [username]);

        if(user.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: "Usuário não encontrado"
            });
        }
            
        const id = user.rows[0].id;
        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
        
        if(!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Senha incorreta"
            })
        }

        const token = generateToken(id, username);

        return res.status(200).json({
            success: true,
            message: "Login efetuado com sucesso",
            token
        });

    } catch (error) {
        return res.status(500).json(error.message);
        
    }
}