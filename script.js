$(document).ready(function () {
    initProducts();
    updateCart();
    initSlider();
    initOutsideClick();
});

// AJAX

function initProducts() {
    if (!localStorage.getItem("pharma_products")) {
        $.get("products.json")
            .done(function (data) {
                saveProducts(data);
                console.log("Products loaded via AJAX");
            })
            .fail(function () {
                console.warn("AJAX failed — using inline defaults.");
                saveProducts(defaultProducts);
            });
    }
}

// Fallback if AJAX fails (no local server)
const defaultProducts = [
    { id: 1, name: "Paracetamol", price: 5, category: "Medicine", discount: true, img: "images/Paracetamol.jpg" },
    { id: 2, name: "Ibuprofen", price: 8, category: "Medicine", discount: false, img: "images/Ibuprofen.jpg" },
    { id: 3, name: "Vitamin C", price: 10, category: "Vitamins", discount: true, img: "images/Vitamin C.jpeg" },
    { id: 4, name: "Baby Shampoo", price: 12, category: "Baby Products", discount: false, img: "images/BabyShampoo.jpg" },
    { id: 5, name: "Multivitamins", price: 15, category: "Vitamins", discount: false, img: "images/Multivitamins.jpeg" },
    { id: 6, name: "Diaper Rash Cream", price: 7, category: "Baby Products", discount: true, img: "images/Diaper Rash Cream.jpeg" },
    { id: 7, name: "Cough Syrup", price: 9, category: "Medicine", discount: false, img: "images/CoughSyrup.jpg" },
    { id: 8, name: "La Roche-Posay", price: 11, category: "Skincare", discount: true, img: "images/La Roche-Posay.jpeg" },
    { id: 9, name: "Baby Lotion", price: 14, category: "Baby Products", discount: false, img: "images/BabyLotion.jpg" },
    { id: 10, name: "La Roche-Posay SPF", price: 13, category: "Skincare", discount: true, img: "images/La Roche-Posay SPF.jpeg" },
    { id: 11, name: "Lip Gloss YSL", price: 6, category: "Beauty & Hair Care", discount: false, img: "images/YSL.jpeg" },
    { id: 12, name: "Kerastase Gloss Absolu", price: 8, category: "Beauty & Hair Care", discount: false, img: "images/Kerastase Gloss Absolu.jpeg" },
    { id: 13, name: "Huda Beauty Easy Bake", price: 9, category: "Beauty & Hair Care", discount: true, img: "images/Huda Beauty Easy Bake.jpeg" },
    { id: 14, name: "Color WOW", price: 12, category: "Beauty & Hair Care", discount: false, img: "images/Color WOW.jpeg" },
    { id: 15, name: "Dior Palette", price: 10, category: "Beauty & Hair Care", discount: true, img: "images/Dior.jpeg" },
    { id: 16, name: "Gisou", price: 14, category: "Beauty & Hair Care", discount: false, img: "images/Gisou.jpeg" },
    { id: 17, name: "La Roche-Posay 2", price: 11, category: "Skincare", discount: true, img: "images/La Roche-Posay (2).jpeg" },
    { id: 18, name: "Princess Rose", price: 13, category: "Beauty & Hair Care", discount: false, img: "images/Princess Rose.jpeg" },
    { id: 19, name: "SPF", price: 9, category: "Skincare", discount: true, img: "images/SPF.jpeg" }
];

// LOCALSTORAGE
function getProducts() {
    const stored = localStorage.getItem("pharma_products");
    if (!stored) { saveProducts(defaultProducts); return defaultProducts; }
    return JSON.parse(stored);
}
function saveProducts(products) {
    localStorage.setItem("pharma_products", JSON.stringify(products));
}
function getNextId() {
    const p = getProducts();
    return p.length === 0 ? 1 : Math.max(...p.map(p => p.id)) + 1;
}

// CRUD
function createProduct(product) {
    const products = getProducts();
    product.id = getNextId();
    products.push(product);
    saveProducts(products);
    return product;
}
function updateProduct(id, data) {
    const products = getProducts();
    const i = products.findIndex(p => p.id === id);
    if (i === -1) return false;
    products[i] = { ...products[i], ...data, id };
    saveProducts(products);
    return true;
}
function deleteProduct(id) {
    saveProducts(getProducts().filter(p => p.id !== id));
}

// DISPLAY PRODUCTS

function displayProducts(list, scroll = false) {
    const $container = $("#productList");
    const $msg = $("#emptyMsg");
    $container.empty();

    if (!list || list.length === 0) {
        $msg.text("No products found.").show();
        return;
    }
    $msg.hide();

    $.each(list, function (i, p) {
        const discountedPrice = p.discount ? (p.price + 3) : null;
        const $card = $(`
            <div class="product" id="product-${p.id}">
                ${p.discount ? '<span class="badge">SALE</span>' : ""}
                <img src="${p.img || 'images/placeholder.jpg'}"
                    onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22160%22><rect width=%22200%22 height=%22160%22 fill=%22%23e8f5e9%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2240%22>💊</text></svg>'" />
                <h4>${p.name}</h4>
                <p class="price">
                    ${p.discount ? "<del>€" + discountedPrice + "</del> " : ""}
                    <strong>€${p.price}</strong>
                </p>
                <div class="qty">
                    <button onclick="decreaseQty(${p.id})">−</button>
                    <span id="qty-${p.id}">1</span>
                    <button onclick="increaseQty(${p.id})">+</button>
                </div>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        `);
        $container.append($card);
    });

    if (scroll) {
        $("html, body").animate({ scrollTop: $container.offset().top - 100 }, 600);
    }
}

function filterCategory(category) {
    displayProducts(getProducts().filter(p => p.category === category), true);
}

// SEARCH

function searchProducts() {
    const keyword = $("#search").val().toLowerCase();
    if (!keyword) { showHome(); return; }
    const filtered = getProducts().filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword)
    );
    displayProducts(filtered, true);
}

function showHome() {
    $("#productList").empty();
    $("#emptyMsg").text("Select a category or browse all products").show();
}

// CART
let cart = JSON.parse(localStorage.getItem("pharma_cart")) || [];
let quantities = {};

function saveCart() { localStorage.setItem("pharma_cart", JSON.stringify(cart)); }

function addToCart(id) {
    const product = getProducts().find(p => p.id === id);
    if (!product) return;
    const qty = quantities[id] || 1;
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.qty += qty; } else { cart.push({ ...product, qty }); }
    saveCart();
    updateCart();
    showToast("✅ " + product.name + " added to cart");
    quantities[id] = 1;
    $("#qty-" + id).text(1);
}

function increaseQty(id) {
    quantities[id] = (quantities[id] || 1) + 1;
    $("#qty-" + id).text(quantities[id]);
}
function decreaseQty(id) {
    if (!quantities[id]) quantities[id] = 1;
    if (quantities[id] > 1) quantities[id]--;
    $("#qty-" + id).text(quantities[id]);
}

function updateCart() {
    const $items = $("#cartItems");
    const $total = $("#total");
    const $count = $("#cartCount");
    $items.empty();
    let sum = 0, totalItems = 0;

    if (cart.length === 0) {
        $items.append('<li class="cart-empty">Your cart is empty</li>');
    }

    $.each(cart, function (index, item) {
        sum += item.price * item.qty;
        totalItems += item.qty;
        $items.append(`
            <li class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <span class="cart-item-qty">×${item.qty}</span>
                </div>
                <div class="cart-item-right">
                    <span>€${(item.price * item.qty).toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                </div>
            </li>
        `);
    });

    $total.text(sum.toFixed(2));
    $count.text(totalItems);
    $count.toggle(totalItems > 0);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function toggleCart() {
    $("#cartBox").toggleClass("show");
}

// CHECKOUT
function showPayment() {
    if (cart.length === 0) { showToast("⚠️ Your cart is empty!"); return; }

    let rows = cart.map(i => `
        <div class="summary-row">
            <span>${i.name} ×${i.qty}</span>
            <span>€${(i.price * i.qty).toFixed(2)}</span>
        </div>`).join("");
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);

    $("#orderSummaryBox").html(`
        <div class="summary-title">Order Summary</div>
        ${rows}
        <div class="summary-row summary-total"><span>Total</span><span>€${total}</span></div>
    `);

    $("#checkoutStep1").show();
    $("#checkoutStep2").hide();
    $("#stepDot1").addClass("active");
    $("#stepDot2").removeClass("active");
    $("#paymentBox").show();
    $("#paymentOverlay").show();
}

function goToStep2() {
    const first = $("#userFirstName").val().trim();
    const last = $("#userLastName").val().trim();
    const email = $("#userEmail").val().trim();
    const phone = $("#userPhone").val().trim();

    if (!first || !last || !email || !phone) { showToast("⚠️ Please fill in all your details."); return; }
    if (!email.includes("@")) { showToast("⚠️ Please enter a valid email address."); return; }

    $("#greetingName").text(first + " " + last);
    $("#cardName").val(first + " " + last);
    $("#checkoutStep1").hide();
    $("#checkoutStep2").show();
    $("#stepDot1").removeClass("active");
    $("#stepDot2").addClass("active");
}

function goBackToStep1() {
    $("#checkoutStep1").show();
    $("#checkoutStep2").hide();
    $("#stepDot1").addClass("active");
    $("#stepDot2").removeClass("active");
}

function closePayment() {
    $("#paymentBox").hide();
    $("#paymentOverlay").hide();
}

function payNow() {
    const num = $("#cardNumber").val().trim();
    const name = $("#cardName").val().trim();
    const expiry = $("#cardExpiry").val().trim();
    const cvv = $("#cardCvv").val().trim();

    if (!num || !name || !expiry || !cvv) { showToast("⚠️ Please fill in all card details."); return; }

    saveOrder();
    closePayment();
    showToast("💳 Payment successful! Thank you for your order.");
    cart = [];
    saveCart();
    updateCart();
    $("#cartBox").removeClass("show");
}

function saveOrder() {
    const orders = JSON.parse(localStorage.getItem("pharma_orders") || "[]");
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
    orders.unshift({
        id: Date.now(),
        date: new Date().toLocaleString(),
        customer: {
            firstName: $("#userFirstName").val().trim(),
            lastName: $("#userLastName").val().trim(),
            email: $("#userEmail").val().trim(),
            phone: $("#userPhone").val().trim(),
        },
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total
    });
    localStorage.setItem("pharma_orders", JSON.stringify(orders));
}

// HEALTH MENU
function toggleHealthMenu() {
    $("#healthMenu").toggleClass("show");
}

function initOutsideClick() {
    $(document).on("click", function (e) {

        if (!$(e.target).closest(".dropdown").length) {
            $("#healthMenu").removeClass("show");
        }
    });
}

const healthData = {
    asthma: { title: "🫁 Asthma & Allergies", tips: ["Use your inhaler as prescribed", "Avoid known triggers (dust, pollen, pets)", "Keep windows closed during high pollen days", "Carry an antihistamine for sudden reactions"], warning: "Seek emergency help if breathing becomes severely difficult." },
    cold: { title: "🤧 Cold & Flu", tips: ["Rest and stay well hydrated", "Take paracetamol or ibuprofen for fever", "Use nasal sprays to relieve congestion", "Flu vaccine recommended every autumn"], warning: "See a doctor if symptoms last more than 10 days or worsen." },
    coronavirus: { title: "🦠 Coronavirus", tips: ["Stay up to date with vaccinations", "Wash hands frequently for 20+ seconds", "Isolate if you test positive", "Wear a mask in crowded indoor spaces if vulnerable"], warning: "Call emergency services if you experience difficulty breathing or chest pain." },
    diabetes: { title: "💉 Diabetes", tips: ["Monitor blood sugar regularly", "Follow a low-sugar, balanced diet", "Exercise at least 30 minutes daily", "Take medication at the same time each day"], warning: "Signs of low blood sugar: dizziness, sweating, confusion — act quickly." },
    hair: { title: "💇 Hair Care", tips: ["Use sulfate-free shampoo for sensitive scalps", "Deep condition once a week", "Avoid excessive heat styling", "Massage scalp to stimulate growth"], warning: "Sudden hair loss may indicate a nutritional deficiency — consult a doctor." },
    mens: { title: "🧔 Men's Health", tips: ["Get a routine check-up annually", "Check blood pressure and cholesterol regularly", "Maintain a healthy weight through diet and exercise", "Talk openly about mental health"], warning: "Do not ignore chest pain, shortness of breath, or unusual lumps." },
    mother: { title: "🤱 Mother & Baby", tips: ["Take folic acid before and during early pregnancy", "Attend all prenatal appointments", "Breastfeed if possible for the first 6 months", "Baby-proof your home before crawling begins"], warning: "Contact your midwife immediately if you experience unusual pain or bleeding." },
    doctor: { title: "👨‍⚕️ Online Doctor Advice", tips: ["Use teleconsultation for non-emergency concerns", "Have your symptoms and medication list ready", "Take notes or record the consultation", "Follow up in person if symptoms persist"], warning: "Online advice does not replace emergency medical care — always call 112 if in danger." },
    oral: { title: "🦷 Oral Health", tips: ["Brush twice daily with fluoride toothpaste", "Floss at least once a day", "Visit your dentist every 6 months", "Avoid sugary drinks and smoking"], warning: "Persistent toothache or bleeding gums should be checked by a dentist promptly." },
    pain: { title: "💊 Pain Management", tips: ["Use paracetamol for mild to moderate pain", "Apply heat/cold packs for muscle pain", "Ibuprofen helps with inflammation", "Do not exceed recommended dosages"], warning: "Chronic or severe pain needs medical evaluation — do not self-medicate long-term." },
    skin: { title: "🧴 Skin Care", tips: ["Apply SPF 30+ sunscreen daily", "Moisturise morning and night", "Stay hydrated — drink at least 2L of water", "Avoid harsh soaps that strip natural oils"], warning: "New or changing moles should be examined by a dermatologist." },
    smoking: { title: "🚭 Stop Smoking", tips: ["Set a quit date and stick to it", "Use nicotine patches or gum to manage cravings", "Avoid triggers: alcohol, coffee, certain social settings", "Join a support group or use a quit-smoking app"], warning: "Talk to your pharmacist about prescription stop-smoking medications." }
};

function showHealthInfo(key) {
    const data = healthData[key];
    if (!data) return;
    $(".menu-left li").removeClass("active");
    $(event.target).addClass("active");
    $("#healthInfoPanel").html(`
        <h3>${data.title}</h3>
        <ul class="health-tips">
            ${data.tips.map(t => "<li>✔ " + t + "</li>").join("")}
        </ul>
        <p class="health-warning">⚠️ ${data.warning}</p>
    `);
}

// SLIDER

function initSlider() {
    let slideIndex = 0;
    const $slides = $(".slide");
    setInterval(function () {
        $slides.removeClass("active");
        slideIndex = (slideIndex + 1) % $slides.length;
        $slides.eq(slideIndex).addClass("active");   // .eq(n) picks the nth element
    }, 3000);
}

// TOAST

function showToast(message) {
    if ($("#toast").length === 0) {
        $("<div>").attr("id", "toast").appendTo("body");
    }
    $("#toast").text(message).addClass("show");
    setTimeout(function () { $("#toast").removeClass("show"); }, 3000);
}

// ADMIN PANEL
function openAdminPanel() {
    $("#adminPanel").addClass("show");
    $("#adminOverlay").show();
    renderAdminTable();
}
function closeAdminPanel() {
    $("#adminPanel").removeClass("show");
    $("#adminOverlay").hide();
    resetForm();
}

function switchTab(tab) {
    $(".admin-tab").addClass("hidden");
    $(".tab-btn").removeClass("active");
    $("#tab-" + tab).removeClass("hidden");
    $(event.target).addClass("active");
    if (tab === "manage") renderAdminTable();
    if (tab === "orders") renderOrders();
}

function renderAdminTable() {
    const keyword = ($("#adminSearch").val() || "").toLowerCase();
    const products = getProducts().filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword)
    );
    $("#productCount").text(getProducts().length);

    if (products.length === 0) {
        $("#adminTableBody").html('<tr><td colspan="6" style="text-align:center;padding:20px;color:#999">No products found</td></tr>');
        return;
    }

    $("#adminTableBody").html(products.map(p => `
        <tr>
            <td><span class="id-badge">#${p.id}</span></td>
            <td><strong>${p.name}</strong></td>
            <td><span class="cat-badge">${p.category}</span></td>
            <td>€${p.price}</td>
            <td>${p.discount ? '<span class="sale-yes">✓ Sale</span>' : '<span class="sale-no">—</span>'}</td>
            <td class="action-btns">
                <button class="edit-btn" onclick="editProduct(${p.id})">✏️ Edit</button>
                <button class="delete-btn" onclick="confirmDelete(${p.id}, '${p.name.replace(/'/g, "\\'")}')">🗑 Delete</button>
            </td>
        </tr>
    `).join(""));
}

function saveProduct() {
    const name = $("#adminName").val().trim();
    const price = parseFloat($("#adminPrice").val());
    const category = $("#adminCategory").val();
    const img = $("#adminImg").val().trim() || "images/placeholder.jpg";
    const discount = $("#adminDiscount").prop("checked");  // .prop("checked") reads checkbox
    const editId = $("#editId").val();

    if (!name || isNaN(price) || price < 0 || !category) {
        showAdminMsg("⚠️ Please fill in Name, Price, and Category.", "error");
        return;
    }
    if (editId) {
        if (updateProduct(parseInt(editId), { name, price, category, img, discount })) {
            showAdminMsg("✅ \"" + name + "\" updated successfully!", "success");
            resetForm();
            renderAdminTable();
            displayProducts(getProducts());
        }
    } else {
        const created = createProduct({ name, price, category, img, discount });
        showAdminMsg("✅ \"" + created.name + "\" added with ID #" + created.id + "!", "success");
        resetForm();
        renderAdminTable();
    }
}

function editProduct(id) {
    const product = getProducts().find(p => p.id === id);
    if (!product) return;
    $(".admin-tab").addClass("hidden");
    $(".tab-btn").removeClass("active");
    $("#tab-add").removeClass("hidden");
    $(".tab-btn:first").addClass("active");
    $("#editId").val(product.id);
    $("#adminName").val(product.name);
    $("#adminPrice").val(product.price);
    $("#adminCategory").val(product.category);
    $("#adminImg").val(product.img);
    $("#adminDiscount").prop("checked", product.discount);  // .prop() sets checkbox
    $("#formTitle").text("✏️ Edit Product #" + product.id);
}

function confirmDelete(id, name) {
    if (confirm("Delete \"" + name + "\"? This cannot be undone.")) {
        deleteProduct(id);
        renderAdminTable();
        displayProducts(getProducts());
        showToast("🗑 \"" + name + "\" deleted.");
    }
}

function renderOrders() {
    const orders = JSON.parse(localStorage.getItem("pharma_orders") || "[]");
    $("#ordersCount").text(orders.length);
    if (orders.length === 0) {
        $("#ordersList").html('<p style="text-align:center;color:#999;padding:40px 0;">No orders yet.</p>');
        return;
    }
    $("#ordersList").html(orders.map(o => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <span class="order-id">#${String(o.id).slice(-6)}</span>
                    <span class="order-date">${o.date}</span>
                </div>
                <span class="order-total">€${o.total}</span>
            </div>
            <div class="order-customer">
                <span>👤 ${o.customer.firstName} ${o.customer.lastName}</span>
                <span>📧 ${o.customer.email}</span>
                <span>📞 ${o.customer.phone}</span>
            </div>
            <div class="order-items">
                ${o.items.map(i => "<span class='order-item'>" + i.name + " ×" + i.qty + " — €" + (i.price * i.qty).toFixed(2) + "</span>").join("")}
            </div>
        </div>
    `).join(""));
}

function clearAllOrders() {
    if (!confirm("Delete all orders? This cannot be undone.")) return;
    localStorage.removeItem("pharma_orders");
    renderOrders();
    showToast("All orders cleared.");
}

function resetForm() {
    $("#editId, #adminName, #adminPrice, #adminCategory, #adminImg").val("");
    $("#adminDiscount").prop("checked", false);
    $("#formTitle").text("Add New Product");
    $("#adminMsg").text("").attr("class", "admin-msg");
}

function showAdminMsg(msg, type) {
    $("#adminMsg").text(msg).attr("class", "admin-msg " + type);
    setTimeout(function () { $("#adminMsg").text("").attr("class", "admin-msg"); }, 4000);
}