import { findElement } from "./helpers.js";

const Base_URL = "https://66cc9f34a4dd3c8a71b842ed.mockapi.io/api/";
const token = localStorage.getItem("token");
const elWrapperProducts = findElement(".arzon__big-div");
const elLoader = findElement("#loader");
const elProductTemplate = findElement("#template");
const elAddBtn = findElement("#add-btn"); 
const elEditBtn = findElement("#edit-btn"); 
const elFormAdd = findElement("#form-add"); 
const elFormEdit = findElement("#form-edit"); 

let products = [];

if (!token) {
    window.location.replace("../index.html");
}

async function getProducts() {
    let res = await fetch(Base_URL + "products");
    let data = await res.json();

    products = data
    elLoader.style.display = "none";
    renderProducts(data);
}

function renderProducts(list = [], parent = elWrapperProducts) {
    parent.textContent = null;
    const fragment = new DocumentFragment();
    list.forEach((product) => {
        const newTemplate = elProductTemplate.content.cloneNode(true);
        const elTopImg = findElement(".mahsulot", newTemplate);
        const elTitle = findElement(".tanlov", newTemplate);
        const elPrice = findElement(".yulov", newTemplate);
        const elEditBtn = findElement(".btn-info", newTemplate);
        const elDiccountPrice = findElement(".sikidga", newTemplate);
        const elFavoritBtn = findElement(".btn-yurak", newTemplate);
        const elShopBtn = findElement(".shop-btn", newTemplate);
        const elDeleteBtn = findElement(".btn-danger", newTemplate);

        if (elDeleteBtn) elDeleteBtn.dataset.id = product.id;
        if (elEditBtn) elEditBtn.dataset.id = product.id;
        if (product.isLiked) {
            elFavoritBtn.src = "imgs/liked.svg";
        }
        if (elFavoritBtn) elFavoritBtn.dataset.id = product.id;
        if (elShopBtn) elShopBtn.dataset.id = product.id;
        if (elTopImg) elTopImg.src = product.image;
        if (elTopImg) elTopImg.dataset.id = product.id;
        if (elTitle) elTitle.textContent = product.title;
        if (elPrice) elPrice.textContent = product.price;
        if (elDiccountPrice) elDiccountPrice.textContent = product.category;

        fragment.appendChild(newTemplate);
    });
    parent.appendChild(fragment);
}

getProducts();




elAddBtn.addEventListener("click", () => {
    console.log(elFormAdd.image.value);

    fetch(Base_URL + 'products', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: elFormAdd.title.value,
            image: elFormAdd.image.value,
            price: elFormAdd.price.value,
            description: elFormAdd.description.value,
            rate: elFormAdd.rate.value
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok.');
        }
        return res.json();
    })
    .then(json => console.log(json))
    .catch(error => console.error('There was a problem with the fetch operation:', error));
});




if (elWrapperProducts) {
    elWrapperProducts.addEventListener("click", (evt) => {
        if (evt.target.className.includes("btn-danger")) {
            const id = evt.target.dataset.id;
            fetch(Base_URL + `products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            })
            .then(json => {
                elLoader.style.display = "block";
                elWrapperProducts.textContent = "";
                getProducts();
                console.log(json);
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
        }

        if (evt.target.className.includes("btn-info")) {
            const id = evt.target.dataset.id;
            console.log(id);

            fetch(Base_URL + `products/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            })
            .then(data => {
                console.log(data);

                elFormEdit.image.value = data.image;
                elFormEdit.title.value = data.title;
                elFormEdit.price.value = data.price;
                elFormEdit.description.value = data.description;
                elFormEdit.rate.value = data.rate;

                elEditBtn.addEventListener("click", () => {
                    fetch(Base_URL + `products/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: elFormEdit.title.value,
                            image: elFormEdit.image.value,
                            price: elFormEdit.price.value,
                            description: elFormEdit.description.value,
                            rate: elFormEdit.rate.value
                        })
                    })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('Network response was not ok.');
                        }
                        return res.json();
                    })
                    .then(json => console.log(json))
                    .catch(error => console.error('There was a problem with the fetch operation:', error));
                });
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
        }
    });
}

