const products = [
    { id: 1, name: "Paracetamol", price: 5, category: "Medicine", discount: true, img: "images/Paracetamol.jpg" },
    { id: 2, name: "Ibuprofen", price: 8, category: "Medicine", discount: false, img: "images/Ibuprofen.jpg" },
    { id: 3, name: "Vitamin C", price: 10, category: "Vitamins", discount: true, img: "images/Vitamin C.jpeg" },
    { id: 4, name: "Baby Shampoo", price: 12, category: "Baby Products", discount: false, img: "images/BabyShampoo.jpg" },
    { id: 5, name: "Multivitamins", price: 15, category: "Vitamins", discount: false, img: "images/Multivitamins.jpeg" },
    { id: 6, name: "Diaper Rash Cream", price: 7, category: "Baby Products", discount: true, img: "images/Diaper Rash Cream.jpeg" },
    { id: 7, name: "CoughSyrup", price: 9, category: "Medicine", discount: false, img: "images/CoughSyrup.jpg" },
    { id: 8, name: "La Roche-Posay", price: 11, category: "Skincare", discount: true, img: "images/La Roche-Posay.jpeg" },
    { id: 9, name: "Baby Lotion", price: 14, category: "Baby Products", discount: false, img: "images/BabyLotion.jpg" },
    { id: 10, name: "La Roche-Posay SPF", price: 13, category: "Skincare", discount: true, img: "images/La Roche-Posay SPF.jpeg" },
    { id: 11, name: "Lip Gloss YSL", price: 6, category: "Beauty", discount: false, img: "images/YSL.jpeg" },
    { id: 12, name: "Kerastase Gloss Absolu", price: 8, category: "Beauty & Hair Care", discount: false, img: "images/Kerastase Gloss Absolu.jpeg" },
    { id: 13, name: "Huda Beauty Easy Bake", price: 9, category: "Beauty & Hair Care", discount: true, img: "images/Huda Beauty Easy Bake.jpeg" },
    { id: 14, name: "Color WOW", price: 12, category: "Beauty & Hair Care", discount: false, img: "images/Color WOW.jpeg" },
    { id: 15, name: "Dior Palette", price: 10, category: "Beauty & Hair Care", discount: true, img: "images/Dior.jpeg" },
    { id: 16, name: "Gisou", price: 14, category: "Beauty & Hair Care", discount: false, img: "images/Gisou.jpeg" },
    { id: 17, name: "La Roche-Posay ", price: 11, category: "Skincare", discount: true, img: "images/La Roche-Posay (2).jpeg" },
    { id: 18, name: "Princess Rose", price: 13, category: "Beauty & Hair Care", discount: false, img: "images/Princess Rose.jpeg" },
    { id: 19, name: "SPF", price: 9, category: "Skincare", discount: true, img: "images/SPF.jpeg" }

];

function displayProducts(list) {
    const container = document.getElementById("productList");
    const msg = document.getElementById("emptyMsg");

    container.innerHTML = "";

    if (!list || list.length === 0) {
        msg.style.display = "block";
        return;
    }

    msg.style.display = "none";

    list.forEach(p => {
        container.innerHTML += `
        <div class="product">
            ${p.discount ? `<span class="badge">SALE</span>` : ""}
            <img src="${p.img}" />
            <h4>${p.name}</h4>
            <p>
                ${p.discount ? `<del>€${p.price + 3}</del>` : ""} €${p.price}
            </p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
        `;
    });
}


function filterCategory(category) {
    const filtered = products.filter(p => p.category === category);

    document.getElementById("emptyMsg").style.display = "none";
    displayProducts(filtered);
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function searchProducts() {
    const keyword = document.getElementById("search").value.toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(keyword)
    );
    displayProducts(filtered);
}

function showHome() {
    document.getElementById("productList").innerHTML = "";
    document.getElementById("emptyMsg").style.display = "block";
}

function getDiscountPrice(price, discountPercent) {
    return (price - (price * discountPercent / 100)).toFixed(2);
}

function toggleHealthMenu() {
    document.getElementById("healthMenu").classList.toggle("show");
}

// mbyll kur klikon jashtë
document.addEventListener("click", function (e) {
    const menu = document.getElementById("healthMenu");
    const trigger = document.querySelector(".dropdown");

    if (!trigger.contains(e.target)) {
        menu.classList.remove("show");
    }
});
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const qty = quantities[id] || 1;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();

    alert("Added to cart 🛒");

    quantities[id] = 1;
    displayProducts();
}

let quantities = {};

function increaseQty(id) {
    quantities[id] = (quantities[id] || 1) + 1;
    document.getElementById(`qty-${id}`).innerText = quantities[id];
}

function decreaseQty(id) {
    if (!quantities[id]) quantities[id] = 1;
    if (quantities[id] > 1) quantities[id]--;
    document.getElementById(`qty-${id}`).innerText = quantities[id];
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const total = document.getElementById("total");

    cartItems.innerHTML = "";
    let sum = 0;

    cart.forEach((item, index) => {
        cartItems.innerHTML += `
    <li>
        ${item.name} - €${item.price}
        <button onclick="removeFromCart(${index})">X</button>
    </li>
    `;
        sum += item.price;
    });

    total.textContent = sum;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function toggleCart() {
    document.getElementById("cartBox").classList.toggle("show");
}

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
    } else {
        alert("Order placed!");
        cart = [];
        localStorage.removeItem("cart");
        updateCart();
    }
}

updateCart();


let index = 0;
const slides = document.querySelectorAll(".slide");

setInterval(() => {
    slides.forEach(s => s.classList.remove("active"));
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
}, 3000);