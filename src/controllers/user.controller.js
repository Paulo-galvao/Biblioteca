import pool from "../database/db.js";
import bcrypt from "bcrypt";
import generateToken from "../services/generate.token.js";

export async function index(req, res) {
    try {
        const users = await pool.query(
            `SELECT id, username, email 
            FROM biblioteca.users 
            ORDER BY id`);

        if (users.rows.length === 0) {
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
        const { username, email, password, passwordConfirmation} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!username || !email || !password,  !passwordConfirmation) {
            return res.status(400).json({
                success: false,
                message: "Não esqueça de informar todos os campos"
            })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Email inválido"
            })
        }

        if(password !== passwordConfirmation) {
            return res.status(400).json({
                sucess: false,
                message: "As senhas precisam ser iguais"
            });
        }

        const cryptPass = await bcrypt.hash(password, 10);

        const data = await pool.query(`
            INSERT INTO biblioteca.users(username, email, password) VALUES($1, $2, $3)     
        `, [username, email, cryptPass]);


        if (data.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "Não foi possivel cadastrar um novo usuário"
            });
        }

        const response = await pool.query(`
            SELECT * FROM biblioteca.users WHERE username=$1    
        `, [username]);

        const user = await response.rows[0];

        const token = generateToken(user.id, user.username);

        return res.status(201).json({
            success: true,
            message: "Novo usuário cadastrado com sucesso",
            token
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: "Nome de usuário ou email em uso"
            })
        }
        return res.status(500).json(error.message);
    }
}

export async function update(req, res) {
    try {
        let { username, email } = req.body;
        const { id } = req.params;
        const logged_id = req.userID;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const userQuery = await pool.query(`
            SELECT username, email 
            FROM biblioteca.users
            WHERE id = $1    
        `, [id]);

        const user = userQuery.rows[0];
        
        if (id != logged_id) {
            return res.status(403).json({
                success: false,
                message: "Somente o dono da conta pode alterar suas informações ou excluir conta"
            });
            
        }
        
        if (!username && !email) {
            return res.status(400).json({
                success: false,
                message: "Preencha algum dos campos",
            });
            
        }
        
        // se usuario atualizar username
        if (username && !email) {
            email = user.email;            
            await pool.query(`
                UPDATE biblioteca.users
                SET username=$1, email=$2
                WHERE id=$3
                `, [username, email, id]);    
            }
            
            
        // se usuario atualizar email
        if (email && !username) {
            username = user.username;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Email inválido",
                });
            }

            await pool.query(`
                UPDATE biblioteca.users
                SET username = $1, email=$2 
                WHERE id=$3`, [username, email, id]
            );


        }

        // se atualizar ambos
        await pool.query(`
                UPDATE biblioteca.users
                SET username=$1, email=$2  
                WHERE id=$3`, [username, email, id]
            );

        const userUpdated = await pool.query(`
                SELECT username, email 
                FROM biblioteca.users 
                WHERE id=$1`, [id]);

        return res.status(200).json({
            success: true,
            message: "Usuário atualizado com sucesso",
            user: userUpdated.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: "Esse email já está cadastrado"
            })
        }
        return res.status(500).json(error.message);
    }
}

export async function resetPassword(req, res) {
    try {
        const { oldPassword, password, passwordConfirmation } = req.body;
        const { id } = req.params;

        const userQuery = await pool.query(`
            SELECT *
            FROM biblioteca.users
            WHERE id = $1    
        `, [id]);

        const user = userQuery.rows[0];

        const isValidPassword = await bcrypt.compare(oldPassword, user.password, )
        
        if(!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Senha incorreta"
            })
        }

        if (password !== passwordConfirmation) {
            return res.status(400).json({
                success: false,
                message: "As senhas precisam ser iguais",
            })
        }

        const cryptedPassword = await bcrypt.hash(password, 10);

        await pool.query(`
            UPDATE biblioteca.users 
            SET password = $1
            WHERE id = $2    
        `, [cryptedPassword, id]);
        
        return res.status(200).json({
            success: true,
            message: "Senha atualizada com sucesso",
        });


    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function destroy(req, res) {
    try {
        const { id } = req.params;
        const logged_id = req.userID;

        if (id != logged_id) {
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
            success: true,
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
            SELECT id, username, email 
            FROM biblioteca.users WHERE id=$1    
        `, [id]);

        if (!user.rowCount || id < 1) {
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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Não esqueça de informar todos os campos"
            });
        }

        const user = await pool.query(`
            SELECT * FROM biblioteca.users WHERE email=$1    
            `, [email]);

        if (user.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        const id = user.rows[0].id;
        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Senha incorreta"
            })
        }

        const token = generateToken(id, email);

        return res.status(200).json({
            success: true,
            message: "Login efetuado com sucesso",
            token
        });

    } catch (error) {
        return res.status(500).json(error.message);

    }
}

export async function dash(req, res) {
    try {
        const user_id = req.userID;

        const books = await pool.query(`
            SELECT 
                u.id AS user_id,
                b.id,
                b.title,
                b.written_by,
                b.description,
                b.first_published,
                b.url_img,
                b.rate
            FROM biblioteca.books b
            JOIN biblioteca.users u ON b.user_id = u.id
            WHERE u.id=$1
        `, [user_id]);

        const user = await pool.query(`
            SELECT id, username, email 
            FROM biblioteca.users
            WHERE id=$1 
        `, [user_id]);


        res.status(200).json({
            success: true,
            logged: true,
            message: "Usuário logado",
            user: {
                ...user.rows[0],
                books: books.rows
            }
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}