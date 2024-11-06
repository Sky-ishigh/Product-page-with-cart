// async function loadNames() {
//   const response = await fetch('/data.json');
//   const names = await response.json();
      
//   console.log(names); 
// }
      
// loadNames();
//the function above can fetch data from json file directly but the data cannot be saved in the 

import myProducts from './data.js'

let emptyCart=new Array(myProducts.length)
  for(let i=0; i<myProducts.length; i++){
    emptyCart[i]=0
}

let count= localStorage.getItem("number-of-items")? JSON.parse(localStorage.getItem("number-of-items")):  emptyCart

// used to determine which products are added in the cart
let isProductInCart= new Array(myProducts.length)
for(let i=0; i<myProducts.length; i++){
  isProductInCart[i]= false
}

let cartStatus= localStorage.getItem("products-in-cart")? JSON.parse(localStorage.getItem("products-in-cart")):  isProductInCart

// console.log(isProductInCart)


// saves the quantity of a product to localstorage
function saveToLocalStorage(){
  localStorage.setItem('number-of-items', JSON.stringify(count))
  localStorage.setItem('products-in-cart', JSON.stringify(cartStatus) )
  updateTotalItems()

  // initializeCartProducts()
  // displayItemsInCart()
}

// displays all the products as cards in the webpage
function displayProducts(){

  let cards=" "
  for(let i=0; i<myProducts.length; i++){
    cards+=`<div class="product-cards">
            <div class="product-image">
                <img src=${myProducts[i].image.desktop} alt="">
            </div>

            <div class="add-to-cart">
                <img src="assets/images/icon-add-to-cart.svg" alt="cart icon">Add to cart
            </div>

            <div class="quantity-selector">
                <span class="decrement-span">
                  <img src="./assets/images/icon-decrement-quantity.svg" alt="">
                </span>
                <span class="quantity-counter"></span>
                <span class="increment-span">
                  <img src="./assets/images/icon-increment-quantity.svg" alt="">
                </span>      
            </div>

            <div class="product-info">
                <p class="category">${myProducts[i].category}</p>
                <p class="product-name">${myProducts[i].name}</p>
                <p class="price"><span>$</span>${myProducts[i].price}</p>
            </div>
      </div>`
  }
  document.querySelector('.cards-container').innerHTML=cards
  activateAddToCart();
}

// activates all add to cart buttons 
function activateAddToCart(){
  let addToCart = document.querySelectorAll(".add-to-cart")
  let quantity=document.querySelectorAll(".quantity-counter")
  let quantitySelector=document.querySelectorAll(".quantity-selector")
  // console.log(count[i])

  addToCart.forEach((addItem, i) => {
    if(count[i]==0){
      addItem.addEventListener("click", ()=> { 
        count[i]=1
        // console.log("additem" + i)
        addToCart[i].style.display='none'
        quantitySelector[i].style.display='flex' 
        activateQuantityCounter(i)

        cartStatus[i]= true;
        displayItemsInCart()

        // displayItemsInCart(i)
        saveToLocalStorage()
      })
    }

    else{
      addItem.removeEventListener("click", null)
      quantity[i].innerHTML=count[i];  
      addToCart[i].style.display='none'
      quantitySelector[i].style.display='flex' 
      activateQuantityCounter(i)
      // isProductInCart[i]= count[i]>0? true: false;

      // displayItemsInCart(i)
      // console.log("event listener removed again"+ i)
    }
  })
    // displayProducts()
}

// changes add to cart 
function activateQuantityCounter(i) {
  let quantitySelector=document.querySelectorAll(".quantity-selector")[i]
  let decrementSpan = document.querySelectorAll(".decrement-span")[i];
  let incrementSpan = document.querySelectorAll(".increment-span")[i];
  let quantityCounter = document.querySelectorAll(".quantity-counter")[i];
  let addToCart = document.querySelectorAll(".add-to-cart")[i]

  // quantitySelector[i].style.display='inline-block' 

  // let totalItems= document.querySelector(".product-total-quantity")

  // updates quantity of a product that are added in cart
  function updateDisplay() {
    quantityCounter.textContent = count[i];
    updateTotalItems()
    // if(count[i]>0){
    //   addToCart.style.display='none';
    //   quantitySelector.style.display='block';
    // }
    // else{
    //   addToCart.style.display='block';
    //   quantitySelector.style.display='none';
    // }

    saveToLocalStorage();
  }

  // increases the quantity of a specific product on clicking "+" icon 
  function increaseQuantity(){
    if (count[i]>0){
      count[i]++;
    }
    updateDisplay();
    console.log(" + button pressed" + i)
  }

  incrementSpan.addEventListener('click', increaseQuantity);

  decrementSpan.addEventListener('click', function decreaseQuantity() 
  {
    console.log(" - button pressed" + i)
    if (count[i] > 1) {
      count[i]--;
      updateDisplay();
      // dis
    } 
    else {
      // Reset to "Add to cart" state
      count[i] = 0;
      cartStatus[i]= false;
      displayItemsInCart()

      saveToLocalStorage();
      addToCart.style.display = 'block';
      quantitySelector.style.display = 'none';
      addToCart.addEventListener("click", () => { 
        count[i]=1
        cartStatus[i]= true;
        // displayItemsInCart()
      })
      decrementSpan.removeEventListener('click', decreaseQuantity)
      incrementSpan.removeEventListener('click', increaseQuantity)
    }
  });
 
  updateDisplay();
}

// updates the total number of items in cart from all the products
function updateTotalItems(){
  let sum= localStorage.getItem("number-of-items")? count.reduce((acc, current) => acc + current, 0):0;

  // displays the top heading with number of items in cart
  let cartHeading = `<h2 class="cart-heading">Your cart (${sum})</h2>`
  // document.querySelector(".cart").innerHTML=cartHeading

  let emptyCart= `<div class="empty-cart">
                    <img src="assets/images/illustration-empty-cart.svg" alt="empty cart icon">
                    <p>Your added items will appear here</p>
                  </div>`
// console.log(sum)
  if(sum==0){
    document.querySelector(".cart").innerHTML= cartHeading + emptyCart
  }
  else{
    emptyCart=`<div class="order-total-div">
    Order Total <span id="total-amount-span">500</span>
    </div>`

    let cartItems=" "

    for(let i=0; i<cartStatus.length; i++){
      if(cartStatus[i]==true){
        cartItems+=`<div class="cart-content">
            <div class="products-in-cart">
                <div>
                    <p class="product-name">${myProducts[i].name}</p>
                    <span class="item-quantity">${count[i]}</span>
                    <span class="price-of-item">${myProducts[i].price}</span>
                    <span class="total-for-item">${count[i]*myProducts[i].price}</span>
                </div>
                <div class="remove-item-div">
                    <img src="./assets/images/icon-remove-item.svg" alt="">
                </div>
            </div>   
        </div>`
      }
    }

    let carbonNeutralDiv=`<div class="carbon-neutral-delivery">
    <span>
    <img src="./assets/images/icon-carbon-neutral.svg" alt="">
    </span>
    <span style="color: black;">This is a 
    <span style="color:black;    font-weight:bold ;">carbon-neural</span> delivery
    </span>
    </div>`

    let confirmOrder=`<button class="confirm-order-btn">
    Confirm Order
    </button>`

    document.querySelector(".cart").innerHTML= cartHeading + cartItems+ carbonNeutralDiv+ confirmOrder
    // document.querySelector("#added-cart-div").innerHTML= displayItemsInCart()
  }
  // else{
  //   document.querySelector(".added-cart-div").innerHTML= displayItemsInCart()
  // } 
}


// function initializeCartProducts(){
//   let itemsInCart=[]
//   for(let i=0; i<count.length; i++){
//     if(count[i]>0){
//       itemsInCart.push= i
//     }
//   }
//   // console.log(itemsInCart)
// }
// initializeCartProducts()


// displays items in cart in their specific divs with a remove span
function displayItemsInCart(){

let cartItems=" "
// cartItems[0]=0

  for(let i=0; i<cartStatus.length; i++){
    if(cartStatus[i]==true){
      cartItems+=`<div class="cart-content">
          <div class="products-in-cart">
              <div>
                  <p class="product-name">${myProducts[i].name}</p>
                  <span class="item-quantity">${count[i]}</span>
                  <span class="price-of-item">${myProducts[i].price}</span>
                  <span class="total-for-item">${count[i]*myProducts[i].price}</span>
              </div>
              <div class="remove-item-div">
                  <img src="./assets/images/icon-remove-item.svg" alt="">
              </div>
          </div>   
      </div>`
    }
    return cartItems
  }
  // const cartItemContainer=document.getElementById("added-cart-div")

  console.log(cartItems)
  // cartItemContainer.innerHTML=cartItems

// document.querySelector(".cart").insertAdjacentHTML('afterbegin', cartItems)
// console.log(cartItems[0])
}
// document.getElementById("added-cart-div").appendChild(document.createElement("p"))
// console.log(document.getElementById("added-cart-div").innerHTML)


window.onload=()=>{
  displayProducts();
  // activateAddToCart();
  updateTotalItems();
  // cartStatus();
  // displayItemsInCart()
}