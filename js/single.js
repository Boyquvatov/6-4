import { findElement } from "./helpers.js";

const elMainImg = findElement("#main-img");
const elTitle = findElement("#title")
const elDesc = findElement("#desc")
const elPrice = findElement("#price")
const elRating = findElement("#rating")
let params = new URLSearchParams(document.location.search);
let id = params.get("id");

fetch("https://fakestoreapi.com/products/" + id)
    .then((res) => res.json())
    .then((json) => {
        console.log(json)
        elMainImg.src = json.image;
        elTitle.textContent = json.title;
        elDesc.textContent = json.description;
        elPrice.textContent = "Price : "+json.price+"$";
        elRating.textContent = "Rating : "+json.rating.rate;
    });
