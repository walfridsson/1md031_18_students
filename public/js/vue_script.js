'use strict';

function MenuItem(name, kc, la, gl, pic) {
	if (gl) {
    this.gluten = "Contains gluten"
  }
  else {
    this.gluten = "Gluten free"
  }
  if (la) {
    this.lactose = "Contains lactose"
  }
  else {
    this.lactose = "Lactose free"
  }
	//this.lactose = la;
	this.kcal = kc;
  this.name = name;
  this.image = pic;

}

function GetInfo() {
  orders.fullname = document.getElementById("fullname").value;
  orders.email = document.getElementById("email").value;
  //this.street = document.getElementById("street").value;
  //this.house = document.getElementById("house").value;
  var e = document.getElementById("payment");
  orders.payment = e.options[e.selectedIndex].value;
  orders.gender = document.querySelector('input[name="gender"]:checked').value;
  var burgerList = "";
  var menuName = new Array(food.length);
  for (var i=0; i<food.length; i++) {
    menuName[i] = menu[i].name;
  }
  for (var i=0; i<food.length; i++) {
    var checkboxes = document.getElementById(menuName[i]);
    if (checkboxes.checked) {
      //console.log("IS CHECKED!");
      burgerList += menuName[i] + ", ";
      //console.log(this.checkBurger);
    }
  }
	orders.checkBurger = burgerList;
}

function displayOrder(offset) {
	orders.adress = offset.x + ", " + offset.y;
	// var info = new GetInfo();
	// var textlist = [info.fullname, info.email, info.payment, info.gender, info.checkBurger]
	//
	// const infobox = document.createElement("p");
	// infobox.textContent = textlist;
	// var item = document.getElementById("infobox").childNodes[0];
	//item.replaceChild(infobox, item.childNodes[0]);

	//document.getElementById('infobox').appendChild(infobox);
}

//var burger1 = new MenuItem("Fire Burger", 432, true, true, "https://cdn.arstechnica.net/wp-content/uploads/2018/08/IF-Burger-800x603.jpg");
//var burger2 = new MenuItem("Fried Burger", 750, true, false, "https://st.depositphotos.com/1102480/3871/i/950/depositphotos_38715153-stock-photo-big-chicken-hamburger.jpg");
//var burger3 = new MenuItem("Veggie Burger", 546, false, true, "https://thumbs.dreamstime.com/z/dubbel-hamburgare-42796790.jpg");
//var menu = [burger1, burger2, burger3];

var menu = new Array(food.length);
for (var i = 0; i<food.length; i++) {
  menu[i] = new MenuItem(food[i].name, food[i].kCal, food[i].lactose, food[i].gluten, food[i].img);
}

console.log("hej");
console.log(food.length);


var socket = io();

var vm = new Vue({
  el: '#vue-container',
  data: {
		burgers:menu,
    orders: {
			fullname: "",
			email: "",
			payment: "",
			checkBurger: "",
			gender: "",
			adress: ""
		},
    position: {
      x: 0,
      y: 0
    }
  },
  created: function () {
    socket.on('initialize', function (data) {
      this.orders = data.orders;
    }.bind(this));

    socket.on('currentQueue', function (data) {
      this.orders = data.orders;
    }.bind(this));
  },
  methods: {
		// markDone: function() {
		// 	console.log(place.adress);
		// 	console.log("markDone");
		// 	var info = new GetInfo();
		// 	var textlist = [orders.fullname, orders.email, orders.payment, orders.gender, orders.checkBurger, orders.adress]
		//
		// 	const infobox = document.createElement("p");
		// 	infobox.textContent = textlist;
		// 	document.getElementById('infobox').appendChild(infobox);
		// },
		getNext: function () {
      var lastOrder = Object.keys(this.orders).reduce(function (last, next) {
        return Math.max(last, next);
      }, 0);
      return lastOrder + 1;
    },
    addOrder: function (event) {
			var info = new GetInfo();
			//var textlist = [orders.fullname, orders.email, orders.payment, orders.gender, orders.checkBurger, orders.adress]
			//var infoList = "Name: " + orders.fullname + "<br>" + "Email: " + orders.email + "<br>";

			const infobox1 = document.createElement("p");
			infobox1.textContent = "Name: " + orders.fullname;
			document.getElementById('customer').appendChild(infobox1);
			const infobox2 = document.createElement("p");
			infobox2.textContent = "Email: " + orders.email;
			document.getElementById('customer').appendChild(infobox2);
			const infobox3 = document.createElement("p");
			infobox3.textContent = "Deliver to: " + orders.adress;
			document.getElementById('customer').appendChild(infobox3);
			const infobox4 = document.createElement("p");
			infobox4.textContent = "Payment method: " + orders.payment;
			document.getElementById('customer').appendChild(infobox4);
			const infobox5 = document.createElement("p");
			infobox5.textContent = "Gender: " + orders.gender;
			document.getElementById('customer').appendChild(infobox5);
			const infobox6 = document.createElement("li");
			infobox6.textContent = orders.checkBurger;
			document.getElementById('summary').appendChild(infobox6);


			socket.emit("addOrder", { orderId: this.getNext(),
                                details: { x: this.position.x,
                                           y: this.position.y },
                                orderItems: [orders.checkBurger],
																persInfo: [orders.fullname, orders.email, orders.payment, orders.gender]
                              });
    },
    clickMap: function(event) {
			var rect = event.target.getBoundingClientRect();
			var x = event.clientX - rect.left;
			var y = event.clientY - rect.top;
			this.position.x = x;
			this.position.y = y;
			var offset = {x:x,
										y:y}
			var place = new displayOrder(offset);
			console.log(orders.adress);
			console.log("clickMap");

    }
  }
});
