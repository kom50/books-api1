const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// mongo db
var MongoClient = require('mongodb').MongoClient;
//
require('dotenv').config();

const app = express();
app.use(cors());

//Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

//
let db;
const main = () => {
	MongoClient.connect(
		process.env.MONGODB_URI,
		{
			auth: { username: 'root', password: '12345' },
		},
		(err, database) => {
			if (err) {
				console.log(err);
				process.exit(1);
			}
			console.log('Connected to database');
			db = database.db(process.env.DB_NAME);

			let server = app.listen(process.env.port, () => {
				let port = server.address().port;
				console.log('Server running at port %d', port);
			});
		}
	);
};

main();
// Error handler
function errorHandler(res, err, msg, code) {
	console.log('Error', err);
	res.status(code || 500).json({ error: msg });
}
// get all books
app.get('/books-api', async (req, res) => {
	console.log('get all book data');
	db.collection('book_api')
		.find({})
		.toArray((err, result) => {
			if (err) {
				errorHandler(res, err.message, 'Failed to fetch book data');
			}
			for (let data of result) {
				delete data._id;
			}
			console.table(result, ['book_id', 'title', 'author', 'page_no']);
			res.json(result);
		});
});

//  add book details
app.post('/books-api', async (req, res) => {
	console.log('post book data');
	try {
		const book = {
			book_id: Number(req.body.book_id),
			title: req.body.title,
			author: req.body.author,
			page_no: Number(req.body.page_no),
		};
		console.log(book);
		const result1 = await db
			.collection('book_api')
			.find({ book_id: book.book_id })
			.toArray();
		if (result1.length !== 0) {
			res.send(`book id ${book.book_id} is already present in database`);
		} else {
			const result = await db.collection('book_api').insertOne(book);
			console.log(result);
			res.send('book is added to database');
		}
	} catch (err) {
		console.log(err);
	}
});

// For find book using id
app.get('/books-api/:id', async (req, res) => {
	console.log('find book data');
	const id = parseInt(req.params.id);
	try {
		const result = await db
			.collection('book_api')
			.find({ book_id: id })
			.toArray();
		if (result.length === 0) {
			res.status(404).send('Book details not found');
		} else {
			res.json(result);
		}
	} catch (err) {
		console.log(err);
	}
});

// For Book delete
app.delete('/books-api/:id', async (req, res, next) => {
	try {
		const id = parseInt(req.params.id);
		console.log('delete book data', id);
		const result = await db
			.collection('book_api')
			.deleteMany({ book_id: id });
		console.log('delete ', result);
		if (result.deletedCount === 0) {
			res.send('Book is not found');
		} else res.send('Book is deleted');
	} catch (err) {
		console.log('err', err);
		res.send('Error when delete attempt');
	}
});

// For Book update
app.put('/books-api/:id', async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		console.log('update book data ', id);

		const result = await db.collection('book_api').updateMany(
			{ book_id: id },
			{
				$set: {
					book_id: Number(req.body.book_id),
					title: req.body.title,
					author: req.body.author,
					page_no: Number(req.body.page_no),
				},
			}
		);

		if (result.modifiedCount === 0) {
			res.send(`Book id ${id} is not found`);
		} else {
			res.send(`Book id ${id} is updated`);
		}
	} catch (err) {
		console.log('update err', err);
	}
});
