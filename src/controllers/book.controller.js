import pool from "../database/db.js";

export async function index(req, res) {
  try {
    const books = await pool.query(`
            SELECT * FROM biblioteca.books    
        `);

    if (books.rows.length === 0) {
      return res.status(400).json({
        error: "Nenhum item cadastrado",
      });
    }

    return res.status(200).json({
      sucess: "Livros cadastrados",
      data: books.rows,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

export async function show(req, res) {
  try {
    let { id } = req.params;

    console.log(id);
    

    const book = await pool.query(
      `
            SELECT * FROM biblioteca.books WHERE id=$1    
        `,
      [id]
    );

    if (book.rowCount === 0) {
      return res.status(400).json({
        error: "Item não localizado",
      });
    }

    return res.status(200).json({
      sucess: "Item localizado",
      data: book.rows,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

export async function store(req, res) {
  try {
    const { title, written_by, description, first_published, url_img } =
      req.body;

    const user_id = req.userID;

    if (!title || !written_by || !description || !first_published || !url_img) {
      return res.status(400).json({
        success: false,
        message: "Não esqueça de preencher todos os campos",
      });
    }

    const book = await pool.query(
      `
            INSERT INTO biblioteca.books
              (title, written_by, description, first_published, user_id, url_img)
            VALUES ($1, $2, $3, $4, $5, $6)    
        `,
      [title, written_by, description, first_published, user_id, url_img]
    );

    return res.status(201).json({
      success: true,
      message: "Item adicionado com successo",
      data: book.rows[0],
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

export async function update(req, res) {
  try {
    const book_id = req.params.id;
    const user_id = req.userID;
    const { title, written_by, description, first_published, url_img } =
      req.body;

    if (!title || !written_by || !description || !first_published || !url_img) {
      return res.status(400).json({
        success: false,
        message: "Não esqueça de preencher todos os campos",
      });
    }

    const response = await pool.query(`
      SELECT * FROM biblioteca.books WHERE id=$1  
    `, [book_id]);

    const book = response.rows[0];

    if(book.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Transição não autorizada. Usuário não é autor do post" 
      });
    }
  
    const bookResponse = await pool.query(`
        UPDATE biblioteca.books
	        SET title=$1,
              written_by=$2,
	            description=$3,
	            first_published=$4, 
	            url_img=$5
        WHERE id=$6;
    `,  [title, written_by, description, first_published, url_img, book_id]);

    console.log(bookResponse);
      if(bookResponse.rowCount !== 1) {
        return res.status(400).json({
          success: false,
          message: "Não foi possível completar a transição"
      });
    }

    
    return res.status(200).json({
      success: true,
      message: "Atualizado com successo"
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

export async function destroy(req, res) {
  try {
    const user_id = req.userID;
    const book_id = req.params.id;

    const response = await pool.query(`
      SELECT * FROM biblioteca.books 
        WHERE id=$1  
    `, [book_id]);

    const book = response.rows[0];

    if(book.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Transição não autorizada. Usuário não é autor do post" 
      });
    }

    const bookResponse = await pool.query(`
      DELETE FROM biblioteca.books 
        WHERE id=$1
    `, [book_id]);

    if(bookResponse.rowCount !== 1) {
      return res.status(400).json({
        success: false,
        message: "Não foi possível completar a transição"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exclusão confirmada com sucesso"
    });

  } catch (error) {
    return res.status(500).json(error.message);
  }
}

