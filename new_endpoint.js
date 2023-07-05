import express from 'express';
import pg from 'pg';
import bodyParser from "body-parser";
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';

let router = express.Router();
router.use(bodyParser.json());
router.use(cookieParser());

let pool = new pg.Pool ({
    host: 'localhost',
    user: 'postgres',
    password: '9pgx49CAT!',
    database: 'recipetool_db',
    port: 5432
});

const API_ID = '69a7fcb9';
const API_KEY = 'af9704dc0d9717d30a1064443f64de01';

// Creating an account - WORKS
router.post('/signup', (req, res) => {
    let { username, password, firstName, lastName, email } = req.body;

    pool.query(`
        SELECT username FROM users WHERE username = $1
    `, [username], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: 'Error checking username'});
        } else {
            if (result.rowCount > 0) {
                res.status(409).json({error: 'Username already exists'});
            } else {
                pool.query(`
                INSERT INTO users (username, password, fname, lname, email)
                VALUES ($1, $2, $3, $4, $5)
                `, [username, password, firstName, lastName, email], (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({error: 'Error creating user'});
                    } else {
                        res.status(201).json('User successfully created!');
                        console.log('user successfully created');
                    }
                });
            }
        }
    });
});

// Logging in - WORKS
router.post('/login', (req, res) => {
    let { username, password } = req.body;

    pool.query(`
        SELECT * FROM users WHERE username = $1 AND password = $2
    `, [username, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error logging in' });
        } else if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid username or password' });
        } else {
            let userId = result.rows[0].user_id;
            let token = jwt.sign({user_id: userId}, 'secret');
            // Send the token
            res.cookie('token', token, { httpOnly: true }).json({ message: 'Successfully logged in' });
            console.log(token, 'successful login');
        }
    });
});

// Searching for a recipe - WORKS
router.get('/recipes', async (req, res) => {
    try {
        const { ingredient, cuisineType, glutenFree, vegan, vegetarian } = req.query;

        const response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${ingredient}&cuisineType=${cuisineType}&health=${glutenFree ? 'gluten-free' : ''}${vegan ? '&health=vegan' : ''}${vegetarian ? '&health=vegetarian' : ''}&app_id=${API_ID}&app_key=${API_KEY}`);

        const data = await response.json();
        console.log(data);

        res.send(data.hits.map(hit => hit.recipe));
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving the recipe information.');
    }
});

// Save a searched recipe - WORKS
router.post('/recipes', (req, res) => {
    const { recipe } = req.body;
    const { label, url, ingredientLines } = recipe;
    const recipe_source = 'Edamam API';

    // Get the token
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const payload = jwt.verify(token, 'secret');
        const userId = payload.user_id;

        pool.query(
            'INSERT INTO recipes (name, url, ingredientlines, source, user_id) VALUES ($1, $2, $3, $4, $5)',
            [label, url, ingredientLines, recipe_source, userId],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error saving recipe');
                } else {
                    res.status(201).send('Recipe saved successfully');
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(401).send('Unauthorized');
    }
});

// Post a user made recipe - WORKS
router.post('/save-recipe', (req, res) => {
    let { name, ingredients, description, url } = req.body;
    let recipe_source = 'Custom Recipe';

    // Get the token
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const payload = jwt.verify(token, 'secret');
        const userId = payload.user_id;

        pool.query(`
            INSERT INTO recipes ( name, ingredientlines, description, url, source, user_id ) VALUES ($1, $2, $3, $4, $5, $6)
        `,[name, ingredients, description, url, recipe_source, userId],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error saving recipe');
                } else {
                    res.status(201).send('Recipe saved successfully');
                }
            });
    } catch (error) {
        console.error(error);
        res.status(401).send('Unauthorized');
    }
});

// View your recipes - WORKS
router.get('/view-recipes', async (req, res) => {
   try {
       const token = req.cookies.token;

       const decodeToken = jwt.verify(token, 'secret');
       const user_id = decodeToken.user_id;

       const { rows } = await pool.query('SELECT * FROM recipes WHERE user_id = $1', [user_id]);
       console.log(rows);
       res.json(rows);
   } catch (err) {
       console.error(err);
       res.status(500).send('Server Error');
   }
});



export default router;









