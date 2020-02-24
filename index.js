//check if dom contents are loaded
if(document.readyState == "loading")
{
	document.addEventListener('DOMContentLoaded',PageLoaded)
}
else
{
	PageLoaded()
}

/**
* PageLoaded function
*/
function PageLoaded()
{
	//event listener to remove items
	var deleteItemButton = document.getElementsByClassName('btn-danger')
	for(var i = 0; i < deleteItemButton.length; i++)
	{
		var button = deleteItemButton[i]
		button.addEventListener('click', deleteItems)
	}
	//event listener to update quantity
	var quantityCart = document.getElementsByClassName('cart-quantity-input')
	for(var i = 0; i < quantityCart.length; i++)
	{
		var quantityInput = quantityCart[i]
		quantityInput.addEventListener('change', quantityUpdate)
	}
	//event listener to add items to cart
	var addToCartButton = document.getElementsByClassName('shop-item-button')
	for(var i = 0; i < addToCartButton.length; i++)
	{
		var addButton = addToCartButton[i]
		addButton.addEventListener('click', addToCart)
	}
}

/**
* delete items function
*/
function deleteItems(event)
{
	//removes item from cart
	var buttonClicked = event.target
	buttonClicked.parentElement.parentElement.remove()
	updateCartTotal()
}

/**
* function to update quantity 
*/
function quantityUpdate(event)
{
	//ensures valid input (number and greater than 0)
	var input = event.target
	if (isNaN(input.value) || input.value <= 0)
	{
		input.value = 1
	}
	//update cart total
	updateCartTotal()
}

/**
* function to retrieve info to add to cart
*/
function addToCart(event)
{
	//retrives necessary information to add to cart
	var button = event.target
	var item = button.parentElement.parentElement
	var itemName = item.getElementsByClassName('shop-item-title')[0].innerText
	var itemPrice = item.getElementsByClassName('shop-item-price')[0].innerText
	var itemImage = item.getElementsByClassName('shop-item-image')[0].src
	//calls addItem with retrieved info
	addItem(itemName,itemPrice,itemImage)
	//update cart total
	updateCartTotal()
}

/**
* function adds item to cart
*/
function addItem(itemName,itemPrice,itemImage)
{
	//adds cart row
	var itemRow = document.createElement('div')
	itemRow.classList.add('cart-row')
	var items = document.getElementsByClassName('cart-items')[0]
	var inCart = items.getElementsByClassName('cart-item-title')
	//if item is already in cart, user is alerted
	for (var i =0; i < inCart.length; i++)
	{
		if (inCart[i].innerText == itemName)
		{
			alert("Item is already in cart!")
			return
		}
	}
	//adds item to cart
    var itemContent = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${itemImage}" width="100" height="100">
            <span class="cart-item-title">${itemName}</span>
        </div>
        <span class="cart-price cart-column">${itemPrice}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
	itemRow.innerHTML = itemContent
	items.append(itemRow)
	//adds event listeners for new items in cart
	itemRow.getElementsByClassName('btn-danger')[0].addEventListener('click',deleteItems)
	itemRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityUpdate)
}

/**
* function to update cart totals
*/
function updateCartTotal()
{
	//arrays with required items to qualify for discounts
	var allDVDS = ["Star Wars Episode VI DVD", "Star Wars Episode V DVD","Star Wars Episode IV DVD"]
	var currentDVDS = []
	var allBlue = ["Star Wars Episode IV Blu-Ray","Star Wars Episode V Blu-Ray","Star Wars Episode VI Blu-Ray"]
	var currentBlue = []
	//cart items and rows
	var cartItems = document.getElementsByClassName('cart-items')[0]
	var cartRows = cartItems.getElementsByClassName('cart-row')
	//variables for price, quantity, and savings
	var totalPrice = 0
	var totalQuantity = 0
	var totalSavings = 0
	//loops through cart rows and updates quantity and price
	for(var i =0; i<cartRows.length; i++)
	{
		var cartRow = cartRows[i]
		var itemName = cartRow.getElementsByClassName('cart-item-title')[0].innerText
		var price = cartRow.getElementsByClassName('cart-price')[0]
		//adds items to array to keep track of required items for discounts
		if (currentDVDS.indexOf(itemName) === -1 && itemName.includes("DVD") )
		{
			currentDVDS.push(itemName)
		}
		//adds items to array to keep track of required items for discounts
		if (currentBlue.indexOf(itemName) === -1 && itemName.includes("Blu"))
		{
			currentBlue.push(itemName)
		}
		//adds to quantity and price (no savings)
		var itemPrice = parseFloat(price.innerText.replace('$',''))
		var quantity = cartRow.getElementsByClassName('cart-quantity-input')[0]
		var itemQuantity = quantity.value
		totalPrice = totalPrice + (itemQuantity * itemPrice)
		totalQuantity = parseInt(totalQuantity) + parseInt(itemQuantity)
	}
	//if user qualifies for dvd discount it is applied
	if (currentDVDS.length === 3)
	{
		//loops through amount of dvds when qualified for discount
		var amountDVDS = 0
		for(var i =0; i<cartRows.length; i++)
		{
			var cartRow = cartRows[i]
			var itemName = cartRow.getElementsByClassName('cart-item-title')[0].innerText
			var quantity = parseInt(cartRow.getElementsByClassName('cart-quantity-input')[0].value)
			if (itemName.includes("DVD"))
			{
				amountDVDS = amountDVDS + quantity
			}
		}
		//applies savings and price
		totalPrice = totalPrice - (amountDVDS * 20 * 0.10)
		totalSavings = totalSavings + amountDVDS * 20 * 0.10
	}
	//if user qualifies for blue ray discount it is applied
	if (currentBlue.length === 3)
	{
		//loops through amount of dvds when qualified for discount
		var amountBlu = 0
		for(var i =0; i<cartRows.length; i++)
		{
			var cartRow = cartRows[i]
			var itemName = cartRow.getElementsByClassName('cart-item-title')[0].innerText
			var quantity = parseInt(cartRow.getElementsByClassName('cart-quantity-input')[0].value)
			if (itemName.includes("Blu"))
			{
				amountBlu = amountBlu + quantity
			}
		}
		//applies savings and price
		totalPrice = totalPrice - (amountBlu * 25 * 0.15)
		totalSavings = totalSavings + (amountBlu * 25 * 0.15)
	}
	//if user qualifies for bulk discount it is applied
	if(totalQuantity >= 100)
	{
		//applies savings and price
		totalSavings = totalSavings + (totalPrice * 0.05)
		totalPrice = totalPrice * 0.95
	}
	//total price and total savings rounded to prevent extended numbers
	totalPrice = Math.round(totalPrice * 100) / 100
	totalSavings = Math.round(totalSavings * 100) / 100
	document.getElementsByClassName('cart-total-price')[0].innerText = "$" + totalPrice
	document.getElementsByClassName('cart-total-quantity')[0].innerText = totalQuantity
	document.getElementsByClassName('cart-total-savings')[0].innerText = "$" + totalSavings
}


