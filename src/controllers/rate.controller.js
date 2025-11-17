import pool from "../database/db.js";

export async function index(req, res) {
  try {
    const rates = await pool.query(`
        Select * From biblioteca.rates;     
    `);

    return res.status(200).json({
        success: true,
        rates: rates.rows
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

export async function store(req, res) {
  try {
    const rate = req.body.rate;
    const book_id = req.params.id;
    const user_id = req.userID;

    if(!rate) {
        return res.status(400).json({
            success: false,
            message: "Valor de avaliação não informado"
        })
    }

    await pool.query(`
        INSERT INTO biblioteca.rates(rate_value, book_id, user_id)
	        Values($1, $2, $3);
    `, [rate, book_id, user_id]);

    await pool.query(`
        Update 
	        biblioteca.books 
	        Set rate= (
		        Select 
			    Sum(rate_value) / Count(rate_value) as media
		        From biblioteca.rates 
		    Where book_id = $1)
        Where id=$2;    
    `, [book_id, book_id]);
    

    return res.status(201).json({
        success: true,
        message: "Avaliação atualizada com sucesso"
    });


  } catch (error) {
    return res.status(500).json(error.message);
  }
}



