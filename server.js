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

////////////////////////////Worldmap Start/////////////////////
//Get visited countries
app.get('/api/worldmap-design', async(req,res)=>{
    const result = await pool.query("SELECT country_code FROM visited_countries WHERE user_id=1;");  
    res.json(result.rows);
});

//world.ejs
app.get('/world', async (req, res) => {
    try {
        res.render('world.ejs',{
            pageName:'world'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, message: 'Error fetching data', error: error.message
        });    

    }   
});

//Search country
app.get('/api/search', async (req, res) => {
    try {
        const countryName = req.query.name;
        let isVisited=true;
        let isValid=true;
        let result = await pool.query(
            "SELECT v.id,v.country_code,v.user_id,c.country_name FROM visited_countries AS v INNER JOIN countries AS c on v.country_code=c.country_code WHERE country_name ILIKE $1",[`${countryName}`]
        );
        if(result.rows<=0){
            result = await pool.query(
                "SELECT country_name,country_code FROM  countries  WHERE country_name ILIKE $1",[`${countryName}`]
            );
            if(result.rows.length==0){
                isValid=false;
            }
            isVisited=false;
        }
        res.json({
            country: result.rows[0], 
            isVisited:isVisited,isValid:isValid
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Show suggestion for country search
app.get('/api/country-search-suggestions', async (req, res) => {
    try {
      const countryName = req.query.name; 
      if (!countryName) return res.json([]); 
  
      const result = await pool.query(
        'SELECT country_name FROM countries WHERE country_name ILIKE $1 LIMIT 5', 
        [`%${countryName}%`]
      );

      res.json(result.rows.map(row => row.country_name)); 
    } catch (err) {
      console.error('Error fetching search suggestions:', err);
      res.status(500).json({ error: 'Server error' });
    }
});

////////////////////////////Worldmap End//////////////////////

app.use((req, res, next) => {
    res.locals.pageName = '';
    next();
});

app.get('/', async (req, res) => {
    const result = await pool.query("SELECT url FROM infos WHERE name='resume';");
    res.render('index.ejs',{
        pageName:'home', resume: result.rows[0].url
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
