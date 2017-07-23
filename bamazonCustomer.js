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
		displayData();
});

function displayData() {
	connection.query("SELECT * FROM products", function(err, data) {
		if (err) throw err;
		for (var i = 0; i < data.length; i++) {
			console.log	(data[i].id + "|",  
			data[i].product_name + " |",
			data[i].department_name + " |",
			data[i].price + " |", 
			data[i].stock_quantity + "|");
		}
		pickProduct();
	}); 
};

function pickProduct() {
	connection.query("SELECT * FROM products", function(err, data) {
		if (err) throw err;
		inquirer
			.prompt([
			 {
				type: "list",
			  name: "choice",
			  choices: function() {
					var choiceA = [];  	
			  	for (var i = 0; i < data.length; i++) {
			  		choiceA.push(String(data[i].id));
			  	}
			  	return choiceA
				},
				message: "Congrats on your bundle of joy! Specify the id of the product you want to buy",
	     },{
				name: "numberOfUnits",
			  message: "How many units would you like?",
			  validate: function(answer) {
			  	if (!isNaN(answer)) {
			  		return true;
			  	} else {
			  		return false;
			  	}
			  }	     
			 }])
	  	.then(function(answer) {
	  		var itemChosen;
	  		for (var i = 0; i < data.length; ++i) {
	  			if (parseInt(answer.choice) === data[i].id) {
	  				itemChosen = data[i];
	  			}
	  		}
	  		if (answer.numberOfUnits <= itemChosen.stock_quantity) {
	  			console.log("\nThank you! Your order of the " + itemChosen.product_name + " has been successfully placed!\n");

	  			var orderTotal = itemChosen.price * answer.numberOfUnits;
	  			console.log("\nYour total for this order is " + " $ " + orderTotal);

					var updatedQuantity = itemChosen.stock_quantity - answer.numberOfUnits; 
	  			var query = "UPDATE products SET stock_quantity = " + updatedQuantity + " WHERE id = " + answer.choice;

	  			console.log("\nWe have " + updatedQuantity + " of the " + itemChosen.product_name 
	  									+ " remaining and a lot more of what your baby needs. Happy Shopping!" );

	  			connection.query(query, function() {
	  				console.log("\n=======================================================================================");
	  				console.log("=======================================================================================\n");

	  				displayData();
	  			})  
	  		} else {

	  			console.log("\nI am sorry, we don't have "  + answer.numberOfUnits + " of the " + itemChosen.product_name 
	  									+ " available! We only have " + itemChosen.stock_quantity  + " in stock! Start Over!");
	  			console.log("\n=======================================================================================");
	  			console.log("=======================================================================================\n");
	  			displayData();
	  		}


	  	})
	});		    
};