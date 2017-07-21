var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({

	host: "localhost", 
	port: 3306,

	user: "root",
	password: "mariam",
	database: "bamazon_db"
});

connection.connect(function(err) {
	if (err) throw err;
	else {
		console.log("connected!");
	}
});