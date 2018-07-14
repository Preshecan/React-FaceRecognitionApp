const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id:'123',
			name:'John',
			email: 'john@gmail.com',
			password: '123',
			entries: 0,
			joined: new Date()
		},
		{
			id:'1234',
			name:'Sally',
			email: 'sally@gmail.com',
			password: '1234',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '365',
			hash: '',
			email:'john@gmail.com'
		}
	]
}

app.get('/', (req,res)=>{
	res.send(database.users);
})

app.post('/signin', (req,res)=>{
	// bcrypt.compare(database.users[2].password, database.login.hash, function(err, res) { //compare encrypted password to stored hash, test by registering a user then loging in with same info
	// 	console.log(res);//true/false
	// 	console.log(database.login.hash);//hashed password
	// });
	if(req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password){
		res.json(database.users[0]);
	}else{
		res.status(400).json('error signing in');
	}
})

app.post('/register', (req,res)=>{
	const {email, name, password} = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {		//encrypt password
    	 database.login.hash = hash;
	});
	database.users.push({
		id:'12345',
		name:name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id',(req,res)=>{
	const { id } = req.params;
	let found = false;

	database.users.forEach(user =>{
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	})
	if(!found){
		res.status(400).json('user not found');
	}	
})

app.put('/image', (req,res)=>{
	const { id } = req.body;
	let found = false;

	database.users.forEach(user =>{
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if(!found){
		res.status(400).json('user not found');
	}
})

app.listen(3000, ()=>{
	console.log("app is running on port 3000");
})



/*
res -> thisis working
/signIn -> POST = success/fail
/register -> POST = new user
/profile/:userId -> GET = user
/image -> PUT = user's score 
*/

