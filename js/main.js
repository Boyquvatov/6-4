import { findElement } from "./helpers.js";
const Base_URL = "https://66cc9f34a4dd3c8a71b842ed.mockapi.io/api/"
const elWrapperProducts = findElement(".arzon__big-div");
const elProductTemplate = findElement("#template");
const elLoader = findElement("#loader");
const elPaginationBtn = findElement("#pagination-btn");

const elSignBtn = findElement("#sign-btn");
const elToTop = findElement("#to-top");
const elInputUserName = findElement("#username");
const elInputPassword = findElement("#password");
const elLoginDiv = findElement("#login-div");
const elIsLogin = findElement("#isLogin");
const elLogout = findElement("#logout");
const elCategoriesContainer = findElement("#categories-container");
let limit = 10;
let products = [];

const token = localStorage.getItem("token");


async function getProducts() {
    let products = await fetch(Base_URL+"products");
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
fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((json) => {
        elCategoriesContainer.textContent = "";
        json.forEach((category) => {
            const newElement = document.createElement("p");
            newElement.className = "big-p";
            newElement.innerHTML = category;

            elCategoriesContainer.appendChild(newElement);
        });
    });



if (token) {
    elLoginDiv.style.display = "none";
    elIsLogin.style.display = "flex";
}

elLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    elLoginDiv.style.display = "flex";
    elIsLogin.style.display = "none";
});

// categories
elCategoriesContainer.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("big-p")) {
        fetch(`https://fakestoreapi.com/products/category/${evt.target.textContent}`)
            .then((res) => res.json())
            .then((json) => {
                renderProducts(json);
            });
    }
});

// pagination
elPaginationBtn.addEventListener("click", () => {
    limit += 10;

    elWrapperProducts.textContent = "";
    elLoader.style.display = "block";
    getProducts();

    if (limit === 20) {
        elPaginationBtn.style.display = "none";
    }
});

// Login
elSignBtn.addEventListener("click", () => {
    const obj = {
        username: elInputUserName.value,
        password: elInputPassword.value,
    };
    fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (res.status !== 200) {
                throw new Error("Invalid login");
            }
            return res.json();
        })
        .then((data) => {
            localStorage.setItem("token", data.token);
            window.location.replace(`../admin.html`);
        })
        .catch((err) => {
            alert("Error: " + err.message);
        });
});

elWrapperProducts.addEventListener("click", (evt) => {
    if (evt.target.className.includes("mahsulot")) {
        const id = evt.target.dataset.id;
        window.location.replace(`../single-product.html?id=${id}`);
    }
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        elToTop.style.display = "inline-block";
    } else {
        elToTop.style.display = "none";
    }
});

elToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
