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
		console.log("Connected as id " + connection.threadId);
		connection.query("SELECT * FROM products", function(err,data){
			if (err) throw err;
			for (var i = 0; i < data.length; i++) {
				console.log(data[i].id + "|",  
							data[i].product_name + " |",
							data[i].department_name + " |",
							data[i].price + " |", 
							data[i].stock_quantity + "|");
			}
			start();
		})	
}); 


function start() {
	inquirer
	  .prompt([
	    {
		  name: "selectProductId",
		  type: "input",
		  message: "\n Congrats on your bundle of joy! Specify the id of the product you want to buy!",
		  validate: function(answer) {
		  	if (!isNaN(answer) && answer <= 10) {
				return true
		  	} else { 
		  		return false
		  	}
		  }	
	    },
		{
		  name: "numberOfUnits",
		  type: "input",
		  message: "How many units would you like?",
		  validate: function(answer) {
		  	if (!isNaN(answer)) {
		  		return true;
		  	} else {
		  		return false;
		  	}
		  }
		}
	])
	  

}

