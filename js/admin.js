import { findElement } from "./helpers.js";

const token = localStorage.getItem("token");
const elWrapperProducts = findElement(".arzon__big-div");
const elLoader = findElement("#loader");
const elProductTemplate = findElement("#template");

if (!token) {
    window.location.replace("../index.html");
}

async function getProducts() {
    let products = await fetch(`https://fakestoreapi.com/products`);
    let data = await products.json();
    elLoader.style.display = "none";
    renderProducts(data);
}
function renderProducts(list = products, parent = elWrapperProducts) {
    parent.textContent = null;
    const fragment = new DocumentFragment();
    list.forEach((product) => {
        const newTemplate = elProductTemplate.content.cloneNode(true);
        const elTopImg = findElement(".mahsulot", newTemplate);
        const elTitle = findElement(".tanlov", newTemplate);
        const elPrice = findElement(".yulov", newTemplate);
        const elRealPrice = findElement(".anarxi", newTemplate);
        const elDiccountPrice = findElement(".sikidga", newTemplate);
        const elFavoritBtn = findElement(".btn-yurak", newTemplate);
        const elShopBtn = findElement(".shop-btn", newTemplate);
        const elDeleteBtn = findElement(".btn-danger", newTemplate);

        elDeleteBtn.dataset.id = product.id;
        if (product.isLiked) {
            elFavoritBtn.src = "imgs/liked.svg";
        }
        elFavoritBtn.dataset.id = product.id;
        elShopBtn.dataset.id = product.id;
        elTopImg.src = product.image;
        elTopImg.dataset.id = product.id;
        elTitle.textContent = product.title;
        elPrice.textContent = product.price;
        // elRealPrice.textContent = product.real_price;
        elDiccountPrice.textContent = product.category;

        fragment.appendChild(newTemplate);
    });
    parent.appendChild(fragment);
}
getProducts();

elWrapperProducts.addEventListener("click", (evt) => {
    if (evt.target.className.includes("btn-danger")) {
        const id = evt.target.dataset.id;
        fetch(`https://fakestoreapi.com/products/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((json) => {
                elLoader.style.display = "block";
                elWrapperProducts.textContent = "";
                getProducts();
            });
    }
});

