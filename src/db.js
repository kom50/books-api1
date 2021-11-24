var MongoClient = require('mongodb').MongoClient;

function connect(db_uri, db_name) {
	MongoClient.connect(
		db_uri,
		{
			auth: { username: 'root', password: '12345' },
		},
		(err, database) => {
			if (err) {
				console.log(err);
				process.exit(1);
			}
			console.log('connected to database');
			return database.db(db_name);
		}
	);
}

module.exports.connect = connect;
