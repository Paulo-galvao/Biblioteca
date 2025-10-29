import pool from "../database/db.js";

export async function index(req, res) {
  try {
    const books = await pool.query(`
            SELECT * FROM books    
        `);

    if (books.rows.length === 0) {
      res.status(400).json({
        error: "Nenhum item cadastrado",
      });
    }

    res.status(200).json({
      sucess: "Livros cadastrados",
      data: books.rows,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function show(req, res) {
  try {
    let { id } = req.params;

    const book = await pool.query(
      `
            SELECT * FROM books WHERE id=$1    
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
    res.status(500).json(error.message);
  }
}

export async function store(req, res) {
  try {
    const { title, written_by, description, first_published, url_img } =
      req.body;

    const user_id = req.userID;

    if (!title || !written_by || !description || !first_published || !url_img) {
      res.status(400).json({
        success: false,
        message: "Não esqueça de preencher todos os campos",
      });
    }

    const book = await pool.query(
      `
            INSERT INTO books(title, written_by, description, first_published, user_id, url_img)
            VALUES ($1, $2, $3, $4, $5, $6)    
        `,
      [title, written_by, description, first_published, user_id, url_img]
    );

    res.status(201).json({
      success: true,
      message: "Item adicionado com successo",
      data: book.rows[0],
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function update(req, res) {
  try {
    

  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function destroy(req, res) {
  try {
  } catch (error) {
    res.status(500).json(error.message);
  }
}
