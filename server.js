import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
const { Pool } = pg;
// const db = await pool.connect();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("frontend"));

// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.TRANSACTION_DB_URL,
    // ssl: { rejectUnauthorized: false }  // Required for Supabase SSL connections
});

// Test database connection
app.get('/test-db1', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blog LIMIT 1;'); // Fetch one row
        pool.release(); // Release the connection back to the pool

        res.json({ success: true, message: 'Connected to database!', sample_data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
    }
});


// Add a new record
app.post('/new', async (req, res) => {
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO blog (title, description) VALUES ($1, $2) RETURNING *;',
            [title, description]
        );
        res.json({ success: true, message: "Item created successfully" });
        res.redirect("/?postCreated=true");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error creating data', error: error.message });
        res.redirect("/?postCreated=false"); 
    }
});

// Delete a record
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM blog WHERE id = $1;', [id]);
        res.json({ success: true, message: "Item deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting data', error: error.message });

        console.error('Error deleting item:', error);
    }
});

////////////////////////////Worldmap Start/////////////////////
let currentUserId = 1;

let users = [
    { id: 1, name: "Angela", color: "blue" },
  ];


  async function checkVisisted() {
   
    const result = await pool.query(
      "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1; ",
      [currentUserId]
    );
    let countries = [];
    result.rows.forEach((country) => {
      countries.push(country.country_code);
    });
    return countries;
  }  
////////////////////////////Worldmap End//////////////////////




app.use((req, res, next) => {
    res.locals.pageName = '';
    next();
});

app.get('/', async (req, res) => {
    res.render('index.ejs',{pageName:'home'});
});

app.get('/world', async (req, res) => {
    try {
        const countries = await checkVisisted();
        const currenUser = await pool.query("SELECT * FROM users WHERE id=1;");
        res.render('world.ejs',{
            pageName:'world',
            countries: countries,
            color: currenUser.rows[0].color,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, message: 'Error fetching data', error: error.message
        });    

    }   
});


app.get('/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blog;');
        // res.json({ success: true, data: result.rows });
        res.render('items.ejs',{data: result.rows});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching data', error: error.message });
    }
});

app.get('/test1', async (req, res) => {
    const result = await pool.query('SELECT * FROM blog LIMIT 1');
    res.render('test.ejs',{sample_data: result.rows, pageName:'home'});
});



// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
