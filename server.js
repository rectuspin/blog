import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
const { Pool } = pg;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("frontend"));

app.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM blog LIMIT 1');
    res.render('index.ejs',{sample_data: result.rows});
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



////////////////////////////Database///////////////////////
// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.TRANSACTION_DB_URL,
    // ssl: { rejectUnauthorized: false }  // Required for Supabase SSL connections
});

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM blog LIMIT 1;'); // Fetch one row
        client.release(); // Release the connection back to the pool

        res.json({ success: true, message: 'Connected to database!', sample_data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
    }
});


// ADD A NEW RECORD
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

// DELETE A RECORD
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
////////////////////////////////////////////////////////////////////


// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
