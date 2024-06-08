const express = require('express');
const routes = require('./components/route');
const app = express();
const port = 3001;
const dbConnect = require('./components/dbConnect(users)');
const bcrypt = require('bcrypt');   
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended:  true }));

app.use(session({
    secret: '#@@@jnnkmasn;lmsaasnk$%kssalllas',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
    
app.use('/', routes);

// Signup form handling
app.post('/signup-form', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const collection = await dbConnect();
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            console.log('User already exists');
            res.render('index', { al_message: 'User already exists!' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await collection.insertOne({
                name: username,
                email,
                password: hashedPassword
            });
            console.log("Data inserted successfully");
            res.render('index', { al_message: 'User created successfully!' });
        }
    } catch (error) {
        console.log('Error while inserting the user data', error);
        res.status(500).send('Internal Server Error');
    }
});

// Login form handling
app.post('/login-form', async (req, res) => {
    const { email, password } = req.body;

    try {
        const cn = await dbConnect();
        const user = await cn.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            console.log('Logged in');
            return res.redirect('/dashboard');
        } else {
            console.log('Invalid login');
            return res.render('index', { al_message: 'Invalid login credentials!' });
        }
    } catch (error) {
        console.log('Error while logging in', error);
        return res.status(500).send("Internal Server Error");
    }
});


    


app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
