let items = [{
    "name": "Cheesecake",
    "category": "desserts",
    "content": "Cheesecake is a sweet dessert consisting of one or more layers. The main, and thickest, layer consists of a mixture of a soft, fresh cheese, eggs, and sugar. If there is a bottom layer, it most often consists of a crust or base made from crushed cookies, graham crackers, pastry, or sometimes sponge cake."
}, {
    "name": "Brownie",
    "category": "desserts",
    "content": "A chocolate brownie or simply a brownie is a square or rectangular chocolate baked confection. Brownies come in a variety of forms and may be either fudgy or cakey, depending on their density. Brownies often, but not always, have a glossy skin on their upper crust."
}, {
    "name": "Spaghetti",
    "category": "entrees",
    "content": "Spaghetti is a long, thin, solid, cylindrical pasta. It is a staple food of traditional Italian cuisine. Like other pasta, spaghetti is made of milled wheat and water and sometimes enriched with vitamins and minerals. Italian spaghetti is typically made from durum wheat semolina."

}, {
    "name": "Meatballs",
    "category": "entrees",
    "content": "A meatball is ground meat rolled into a ball, sometimes along with other ingredients, such as bread crumbs, minced onion, eggs, butter, and seasoning. Meatballs are cooked by frying, baking, steaming, or braising in sauce. There are many types of meatballs using different types of meats and spices."
}, {
    "name": "Iced coffee",
    "category": "drinks",
    "content": "Iced coffee is a coffee beverage served cold. It may be prepared either by brewing coffee normally and then serving it over ice or in cold milk, or by brewing the coffee cold. In hot brewing, sweeteners and flavoring may be added before cooling, as they dissolve faster. "
}, {
    "name": "Iced tea",
    "category": "drinks",
    "content": "Iced tea is a form of cold tea. Though it is usually served in a glass with ice, it can refer to any tea that has been chilled or cooled. It may be sweetened with sugar or syrup"
}];

let categories = ["desserts", "entrees", "drinks"];


// Desserts, Entree, Drink
class Item {
    constructor(name, category, content) {
        this.name = name;
        this.category = category;
        this.content = content;
    }
}

// Adding data to localStorage
class Data {
    constructor(obj) {
        // save the object with 
        // alert(new Date().toLocaleString())

        // check if item already exists
        if (localStorage.getItem(obj.name)) {
            // only get the part after M, (10/17/2022, 1:03:37 AM,99)
            // so that we can get the current count easily.
            let count = localStorage.getItem(obj.name).split('M,');
            count = count[1];
            localStorage.setItem(`${obj.name}`, [new Date().toLocaleString(), ++count]);
        }
    }
}


// Displaying the stuff
class Display {

    itemsHTML = document.getElementById("items");
    ordersHTML = document.getElementById("orders");
    graph = new Graph();

    constructor() {
        // create items, and add them to the page
        for (let obj of items) {
            // create the object
            // https://stackoverflow.com/questions/5873624/parse-json-string-into-a-particular-object-prototype-in-javascript
            Object.assign(new Item, obj);
            // create the div
            let itemDiv = document.createElement("div");
            itemDiv.classList.add("item");
            this.itemsHTML.appendChild(itemDiv);

            // sub divs
            let name = document.createElement("div");
            name.innerHTML = obj.name;
            name.classList.add("item-name")
            itemDiv.appendChild(name);

            let category = document.createElement("div");
            // category.innerHTML = obj.category;
            category.classList.add(`${obj.category}-item`);
            itemDiv.appendChild(category);

            let content = document.createElement("div");
            content.innerHTML = obj.content;
            content.classList.add("item-content");
            itemDiv.appendChild(content);

            // initializing the local storage if doesn't exist
            if (!(localStorage.getItem(obj.name))) localStorage.setItem(`${obj.name}`, ['12:00AM', 0]);

            // adding event listener for local storage
            itemDiv.addEventListener("click", () => {
                let data = new Data(obj);
                this.updateOrder(itemDiv);
            })
        }

        // create a new order div for each item in localeStorage
        for (let i = 0; i < localStorage.length; i++) {
            let orderDiv = document.createElement("div");
            orderDiv.setAttribute("id", localStorage.key(i));
            orderDiv.classList.add("order");
            this.ordersHTML.appendChild(orderDiv);
            // not displayed if empty
            if (parseInt(localStorage.getItem(localStorage.key(i)).split('M,')[1]) === 0) orderDiv.style.display = "none";

            // sub divs of order div
            let itemName = document.createElement("div");
            itemName.innerHTML = localStorage.key(i);
            itemName.classList.add("order-item-name");
            orderDiv.appendChild(itemName);

            let date = document.createElement("div");
            date.innerHTML = localStorage.getItem(localStorage.key(i));
            date.classList.add("order-date");
            orderDiv.appendChild(date);
        }

        // event listener for the orders, so that you can decrease the quantity or delete them
        let allOrders = document.getElementsByClassName("order");
        for (let o of allOrders) {
            o.addEventListener("click", () => {
                let orderName = o.children[0].textContent;
                let currentQuantity = localStorage.getItem(orderName).split('M,');
                currentQuantity = currentQuantity[1];

                // current count is less than or equal to 1 -> will be completely deleted
                if (currentQuantity <= 1) {
                    localStorage.removeItem(orderName);
                    o.remove();
                } else {
                    localStorage.setItem(`${orderName}`, [new Date().toLocaleString(), --currentQuantity]);
                    this.updateOrder(o);
                }
            })
        }
    }

    updateOrder(div) {
        // get the text value of the div
        // console.table(div);
        const divContent = div.children[0].textContent;
        const targetDiv = document.getElementById(divContent);
        targetDiv.style.display = "flex";

        // get the name of the target div (no need to modify)
        let itemName = targetDiv.children[0];
        // get the date and quantity
        let itemDetails = targetDiv.children[1];

        // get the most recent -updated- data from localstorage and display it
        // itemName.innerHTML = "DEBUG";
        itemDetails.innerHTML = localStorage.getItem(divContent);
    }

}

// Creating a Pie Chart with Chartjs
class Graph {
    categories = [];
    categoryValues = [];
    constructor() {
        // Display graph
        // total of 3 categories
        let categoryFrequencyCounter = {
            desserts: 0,
            entrees: 0,
            drinks: 0
        };

        for (let i = 0; i < localStorage.length; i++) {
            let it = items.find(it => it.name === localStorage.key(i));
            categoryFrequencyCounter[it.category] += parseInt(localStorage.getItem(localStorage.key(i)).split('M,')[1]);
        }

        // Check the console
        console.log(categoryFrequencyCounter);

        // construxt x values from the frequency counter
        let categories = Object.keys(categoryFrequencyCounter);
        // construct y values from the frequency counter
        let categoryValues = Object.values(categoryFrequencyCounter);

        new Chart("graph", {
            type: "pie",
            data: {
                labels: categories,
                datasets: [{
                    backgroundColor: ["#EEE3CB", "#73777B", "#15133C"],
                    data: categoryValues,
                }]
            },
        });
    }

}


let dp = new Display();