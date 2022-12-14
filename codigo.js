// Shopping cart simulator

//Products

// Class constructor
class Product {
    constructor (id,name, price, photo) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.photo = photo;
    }
}

class CartElement {
    constructor (product, quantity) {
        this.product= product;
        this.quantity= quantity;
    }
}

// const and let
const americanDollars = Intl.NumberFormat('en-US');

let productsJSON = [];

let cartElements = JSON.parse(localStorage.getItem("shoppingCart")) || [];

const productContainer = document.getElementById('product-container').getElementsByClassName('row');

const container = productContainer[0];

const cartContainer = document.querySelector("#items")

const footerContainer = document.querySelector("#footer")

// Function execution

loadCart();
drawCart();
createProductItems();
getJSON();


// Function to load products manually without products.json
/*
function loadProducts () {
    products.push (new Product (1, 'Orchid Lady of the Night', 1.2, 'imagen/ladyofthenight.png'));
    products.push (new Product (2, 'Orchid Lady Slipper', 2.5, 'imagen/ladyslipperorchid.png'));
    products.push (new Product (3, 'Spider Orchid', 0.75, 'imagen/spider_orchid.png'));
    products.push (new Product (4, 'Clamshell Orchid', 1.0, 'imagen/clamshell.png'));
    products.push (new Product (5, 'Dragon Mouth Orchid', 2.5, 'imagen/dragon.png'));
    products.push (new Product (6, 'Acuna Star Orchid', 2.9, 'imagen/acuna.png'));
}
*/

function loadCart () {
    /*let cartEls = new CartElement (
        new Product (1, 'Orquídea 1', 1.2, './imagen/ladyofthenight.png'),
        1
    );

    cartElements.push(cartEls);*/
}

//Function to create cart

function drawCart () {

    let cartSum = 0;
    cartContainer.innerHTML = '';

    cartElements.forEach (
        (element) => {
            let cartRows = document.createElement ("tr");

            cartRows.innerHTML =`
                    <td>${element.product.id}</td>
                    <td>${element.product.name}</td>
                    <td><input id="product-quantity-${element.product.id}" type="number" value="${element.quantity}" min="1" max="100" step="1" style="width: 50px;"/></td>
                    <td>$ ${americanDollars.format(element.product.price)}</td>
                    <td>$ ${americanDollars.format(element.product.price*element.quantity)}</td>
                    <td><td><button id="delete-product-${element.product.id}" type="button" class="btn btn-danger"><i class="bi bi-trash-fill"></i></button></td></td>
            `;

            localStorage.setItem("shoppingCart", JSON.stringify(cartElements));

            cartContainer.append(cartRows);

            cartSum +=element.product.price*element.quantity;

            // Adding events to the cart

            let productsQuantity = document.getElementById(`product-quantity-${element.product.id}`);

            productsQuantity.addEventListener("change", (ev) => {
                let newQuantity = ev.target.value;
                element.quantity = newQuantity;
                drawCart();
            });

            let buttonDelete = document.getElementById(`delete-product-${element.product.id}`);

            buttonDelete.addEventListener("click", (e) => {
                removeProduct (element);
                drawCart();
             })
        }
    );

    if (cartElements.length == 0) {
        footerContainer.innerHTML =  `
        <th scope="row" colspan="5">Your shopping cart is empty. Add items to start!</th>
        `;
    } else {
        footerContainer.innerHTML =  `
        <th scope="row" colspan="5">Total price: $${americanDollars.format(cartSum)}</th>
        `;

    }

    //Clear local storage when cart is empty
    cartElements.length== 0 && localStorage.clear ();
}

function removeProduct (elementBeingDeleted) {
    const elementBeingKept = cartElements.filter ((element) => elementBeingDeleted.product.id != element.product.id);
    cartElements.length = 0;

    elementBeingKept.forEach((element) => cartElements.push(element));
}


//Cards creation

function createCard(product) {
    //Button
    let addButton = document.createElement("button");
    addButton.className = "btn btn-success";
    addButton.innerText = "Buy";

    //Card body
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerHTML = `
        <h5>${product.name}</h5>
        <p>$ ${americanDollars.format(product.price)} USD</p>
    `;
    cardBody.append(addButton);

    //Image
    let image = document.createElement("img");
    image.src = product.photo;
    image.className = "card-img-top";
    image.alt = product.name;

    //Card
    let card = document.createElement("div");
    card.className = "card";
    card.append(image);
    card.append(cardBody);

    //Card container
    let cardContainer = document.createElement("div");
    cardContainer.className = "col-xs-6 col-sm-3 col-md-3";
    cardContainer.append(card);

    //Events (add item to cart)
    addButton.onclick = () => {
        
        let existingElement = cartElements.find((element) => element.product.id == product.id)
        if (existingElement) {
            existingElement.quantity+=1;
        } else {
            let cartEls = new CartElement(product, 1);
        cartElements.push(cartEls);

        }

        drawCart();

        drawCart();
        //Alert (item added to cart)
        Swal.fire(
            ''+product.name,
            'Product added to cart.',
            'success'
          )
    } 
    
    return cardContainer;

}

function createProductItems() {
    container.innerHTML = "";

    productsJSON.forEach(
        (product) => {
            let cardContainer = createCard(product);
            container.append(cardContainer);
        }
    );

}

//Buy items in cart --> checkout form
let checkout= "checkout.html"

let buy=document.getElementById("buy");
buy.onclick=()=>{
 if (cartElements.length!== 0){
    window.location.replace(checkout)
}else{
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please add items to your cart first!',
      })
}
}

//Using fetch to load products.json

async function getJSON(){
    const resp= await fetch('products.json');
    const data= await resp.json();
    productsJSON = data;
    createProductItems();
}
