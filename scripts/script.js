uri = 'https://market-backend-production.up.railway.app/'

// Ejemplo implementando el metodo POST:
async function postData(url = '', data = {}) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            // 'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)  // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function postData2(method, url, data, header) {
    // Opciones por defecto estan marcadas con un *
    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: header,
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formBody, // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function loadProducts() {
    let products = document.getElementById('products');
    products.innerHTML = '';

    fetch(uri + "products")
        .then(response => response.json())
        .then(data => {

            data.forEach(element => {
                r = createCard(element.Name, element.Price, element.Discount, element.Id, element.Category, element.Url_image);
                products.appendChild(r);
            });
        }
        );

}

function loadCategories() {
    let cat = document.getElementById('categories');
    cat.innerHTML = '<option value="0">Todos</option>';
    fetch(uri + "categories")
        .then(response => response.json())
        .then(data => {

            data.forEach(e => {
                r = createItemDropDownButton(e.Name, e.Id);
                cat.appendChild(r);
            })

        }
        );
    cat.addEventListener("change", (event) => {
        getByCategory(event.target.value)
    })
}

function getByCategory(id) {

    let products = document.getElementById('products');
    products.innerHTML = '';

    fetch(uri + "products/" + id)
        .then(response => response.json())
        .then(data => {

            data.forEach(element => {
                r = createCard(element.Name, element.Price, element.Discount, element.Id, element.Category, element.Url_image);
                products.appendChild(r);
            });
        });
}

function getByName(event) {

    let products = document.getElementById('products');
    products.innerHTML = '';

    body = {
        Name: event.target.value,
        IdCategory: document.getElementById("categories").value
    }

    postData2("POST", uri + "products/search", body, {
        "Content-Type": "application/x-www-form-urlencoded",
    }).then(data => {

        data.forEach(element => {
            r = createCard(element.Name, element.Price, element.Discount, element.Id, element.Category, element.Url_image);
            products.appendChild(r);
        });
    });


}

function createCard(name, price, discount, id, category, url) {
    var productCard = document.createElement("div");
    productCard.className = "card";
    productCard.setAttribute("style", "width: 18rem; margin-left:auto; margin-right: auto; margin-top: 1rem;");

    var img = document.createElement("img");
    img.className = "card-img-top p-4";
    img.style.height = "180px";
    img.style.objectFit = "contain";
    img.src = url;

    var cardBody = document.createElement("div");

    var productName = document.createElement("h5");
    productName.innerText = name;
    var description = document.createElement("p");
    var description2 = document.createElement("p");


    cardBody.className = "card-body";


    productName.className = "card-title";
    description.className = "card-text mb-0";
    description.innerText = "Precio: S/." + price;
    description2.className = "card-text";
    description2.innerText = "Descuento: " + discount + "%";


    cardBody.appendChild(productName);
    cardBody.appendChild(description);
    cardBody.appendChild(description2);

    productCard.appendChild(img);
    productCard.appendChild(cardBody);

    return productCard;
}

function createItemDropDownButton(name, id) {
    let item = document.createElement('option');

    item.value = id
    item.innerText = name
    return item
}