import { findElement } from "./helpers.js";
const Base_URL = "https://66cc9f34a4dd3c8a71b842ed.mockapi.io/api/"

const elMainImg = findElement("#main-img");
const elTitle = findElement("#title")
const elDesc = findElement("#desc")
const elPrice = findElement("#price")
const elRating = findElement("#rating")
let params = new URLSearchParams(document.location.search);
let id = params.get("id");

fetch(Base_URL+"products/" + id)
    .then((res) => res.json())
    .then((json) => {
        console.log(json)
        elMainImg.src = json.image;
        elTitle.textContent = json.title;
        elDesc.textContent = json.description;
        elPrice.textContent = "Price : "+json.price+"$";
        elRating.textContent = "Rating : "+json.rate;
    });
