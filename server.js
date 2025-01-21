

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(cors()); // Allow all origins (change later for security)
app.use(express.json());

// Route to get projects from Supabase
app.get('/projects', async (req, res) => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
