// ─── DEFAULT PRODUCT DATA ───────────────────────────────────
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
    { id: 13, name: "Color WOW", price: 12, category: "Beauty & Hair Care", discount: false, img: "images/Color WOW.jpeg" },
    { id: 14, name: "Dior Palette", price: 10, category: "Beauty & Hair Care", discount: true, img: "images/Dior.jpeg" },
    { id: 15, name: "Gisou", price: 14, category: "Beauty & Hair Care", discount: false, img: "images/Gisou.jpeg" },
    { id: 16, name: "La Roche-Posay 2", price: 11, category: "Skincare", discount: true, img: "images/La Roche-Posay (2).jpeg" },
    { id: 17, name: "Princess Rose", price: 13, category: "Beauty & Hair Care", discount: false, img: "images/Princess Rose.jpeg" },
    { id: 18, name: "SPF", price: 9, category: "Skincare", discount: true, img: "images/SPF.jpeg" }
];

// LOCALSTORAGE HELPERS

function getProducts() {
    const stored = localStorage.getItem("pharma_products");
    if (!stored) {
        localStorage.setItem("pharma_products", JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(stored);
}

function saveProducts(products) {
    localStorage.setItem("pharma_products", JSON.stringify(products));
}

function getNextId() {
    const products = getProducts();
    if (products.length === 0) return 1;
    return Math.max(...products.map(p => p.id)) + 1;
}

// CRUD OPERATIONS

function createProduct(product) {
    const products = getProducts();
    product.id = getNextId();
    products.push(product);
    saveProducts(products);
    return product;
}

function updateProduct(id, updatedData) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products[index] = { ...products[index], ...updatedData, id };
    saveProducts(products);
    return true;
}

function deleteProduct(id) {
    const products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
}

//  DISPLAY PRODUCTS 
function displayProducts(list, scroll = false) {
    const container = document.getElementById("productList");
    const msg = document.getElementById("emptyMsg");
    container.innerHTML = "";

    if (!list || list.length === 0) {
        msg.style.display = "block";
        msg.textContent = "No products found.";
        return;
    }
    msg.style.display = "none";

    list.forEach(p => {
        const discountedPrice = p.discount ? (p.price + 3) : null;
        container.innerHTML += `
        <div class="product" id="product-${p.id}">
            ${p.discount ? `<span class="badge">SALE</span>` : ""}
            <img src="${p.img || 'images/placeholder.jpg'}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22160%22><rect width=%22200%22 height=%22160%22 fill=%22%23e8f5e9%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2240%22>💊</text></svg>'" />
            <h4>${p.name}</h4>
            <p class="price">
                ${p.discount ? `<del>€${discountedPrice}</del> ` : ""}
                <strong>€${p.price}</strong>
            </p>
            <div class="qty">
                <button onclick="decreaseQty(${p.id})">−</button>
                <span id="qty-${p.id}">1</span>
                <button onclick="increaseQty(${p.id})">+</button>
            </div>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>`;
    });

    if (scroll) {
        document.getElementById("productList").scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function filterCategory(category) {
    const filtered = getProducts().filter(p => p.category === category);
    document.getElementById("emptyMsg").style.display = "none";
    displayProducts(filtered);
    // Scroll to products
    document.getElementById("productList").scrollIntoView({ behavior: "smooth", block: "start" });
}

function searchProducts() {
    const keyword = document.getElementById("search").value.toLowerCase();
    if (!keyword) { showHome(); return; }
    const filtered = getProducts().filter(p => p.name.toLowerCase().includes(keyword));
    displayProducts(filtered);
}

function showHome() {
    document.getElementById("productList").innerHTML = "";
    const msg = document.getElementById("emptyMsg");
    msg.style.display = "block";
    msg.textContent = "Select a category or browse all products";
}

// CART
let cart = JSON.parse(localStorage.getItem("pharma_cart")) || [];
let quantities = {};

function saveCart() {
    localStorage.setItem("pharma_cart", JSON.stringify(cart));
}

function addToCart(id) {
    const product = getProducts().find(p => p.id === id);
    if (!product) return;
    const qty = quantities[id] || 1;
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }

    saveCart();
    updateCart();
    showToast(`✅ ${product.name} added to cart`);
    quantities[id] = 1;
    const qtyEl = document.getElementById(`qty-${id}`);
    if (qtyEl) qtyEl.textContent = 1;
}

function increaseQty(id) {
    quantities[id] = (quantities[id] || 1) + 1;
    const el = document.getElementById(`qty-${id}`);
    if (el) el.textContent = quantities[id];
}

function decreaseQty(id) {
    if (!quantities[id]) quantities[id] = 1;
    if (quantities[id] > 1) quantities[id]--;
    const el = document.getElementById(`qty-${id}`);
    if (el) el.textContent = quantities[id];
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const totalEl = document.getElementById("total");
    const countEl = document.getElementById("cartCount");

    cartItems.innerHTML = "";
    let sum = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<li class="cart-empty">Your cart is empty</li>`;
    }

    cart.forEach((item, index) => {
        sum += item.price * item.qty;
        totalItems += item.qty;
        cartItems.innerHTML += `
        <li class="cart-item">
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span class="cart-item-qty">×${item.qty}</span>
            </div>
            <div class="cart-item-right">
                <span>€${(item.price * item.qty).toFixed(2)}</span>
                <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
            </div>
        </li>`;
    });

    totalEl.textContent = sum.toFixed(2);
    countEl.textContent = totalItems;
    countEl.style.display = totalItems > 0 ? "inline-block" : "none";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function toggleCart() {
    document.getElementById("cartBox").classList.toggle("show");
}

function showPayment() {
    if (cart.length === 0) { showToast("⚠️ Your cart is empty!"); return; }
    document.getElementById("paymentBox").style.display = "block";
    document.getElementById("paymentOverlay").style.display = "block";
}

function closePayment() {
    document.getElementById("paymentBox").style.display = "none";
    document.getElementById("paymentOverlay").style.display = "none";
}

function payNow() {
    const num = document.getElementById("cardNumber").value.trim();
    const name = document.getElementById("cardName").value.trim();
    const expiry = document.getElementById("cardExpiry").value.trim();
    const cvv = document.getElementById("cardCvv").value.trim();

    if (!num || !name || !expiry || !cvv) {
        showToast("⚠️ Please fill in all card details.");
        return;
    }

    closePayment();
    showToast("💳 Payment successful! Thank you!");
    cart = [];
    saveCart();
    updateCart();
    toggleCart();
}

// HEALTH MENU
function toggleHealthMenu() {
    document.getElementById("healthMenu").classList.toggle("show");
}

const healthData = {
    asthma: {
        title: "🫁 Asthma & Allergies",
        tips: ["Use your inhaler as prescribed", "Avoid known triggers (dust, pollen, pets)", "Keep windows closed during high pollen days", "Carry an antihistamine for sudden reactions"],
        warning: "Seek emergency help if breathing becomes severely difficult."
    },
    cold: {
        title: "🤧 Cold & Flu",
        tips: ["Rest and stay well hydrated", "Take paracetamol or ibuprofen for fever", "Use nasal sprays to relieve congestion", "Flu vaccine recommended every autumn"],
        warning: "See a doctor if symptoms last more than 10 days or worsen."
    },
    coronavirus: {
        title: "🦠 Coronavirus",
        tips: ["Stay up to date with vaccinations", "Wash hands frequently for 20+ seconds", "Isolate if you test positive", "Wear a mask in crowded indoor spaces if vulnerable"],
        warning: "Call emergency services if you experience difficulty breathing or chest pain."
    },
    diabetes: {
        title: "💉 Diabetes",
        tips: ["Monitor blood sugar regularly", "Follow a low-sugar, balanced diet", "Exercise at least 30 minutes daily", "Take medication at the same time each day"],
        warning: "Signs of low blood sugar: dizziness, sweating, confusion — act quickly."
    },
    hair: {
        title: "💇 Hair Care",
        tips: ["Use sulfate-free shampoo for sensitive scalps", "Deep condition once a week", "Avoid excessive heat styling", "Massage scalp to stimulate growth"],
        warning: "Sudden hair loss may indicate a nutritional deficiency — consult a doctor."
    },
    mens: {
        title: "🧔 Men's Health",
        tips: ["Get a routine check-up annually", "Check blood pressure and cholesterol regularly", "Maintain a healthy weight through diet and exercise", "Talk openly about mental health"],
        warning: "Do not ignore chest pain, shortness of breath, or unusual lumps."
    },
    mother: {
        title: "🤱 Mother & Baby",
        tips: ["Take folic acid before and during early pregnancy", "Attend all prenatal appointments", "Breastfeed if possible for the first 6 months", "Baby-proof your home before crawling begins"],
        warning: "Contact your midwife immediately if you experience unusual pain or bleeding."
    },
    doctor: {
        title: "👨‍⚕️ Online Doctor Advice",
        tips: ["Use teleconsultation for non-emergency concerns", "Have your symptoms and medication list ready", "Take notes or record the consultation", "Follow up in person if symptoms persist"],
        warning: "Online advice does not replace emergency medical care — always call 112 if in danger."
    },
    oral: {
        title: "🦷 Oral Health",
        tips: ["Brush twice daily with fluoride toothpaste", "Floss at least once a day", "Visit your dentist every 6 months", "Avoid sugary drinks and smoking"],
        warning: "Persistent toothache or bleeding gums should be checked by a dentist promptly."
    },
    pain: {
        title: "💊 Pain Management",
        tips: ["Use paracetamol for mild to moderate pain", "Apply heat/cold packs for muscle pain", "Ibuprofen helps with inflammation", "Do not exceed recommended dosages"],
        warning: "Chronic or severe pain needs medical evaluation — do not self-medicate long-term."
    },
    skin: {
        title: "🧴 Skin Care",
        tips: ["Apply SPF 30+ sunscreen daily", "Moisturise morning and night", "Stay hydrated — drink at least 2L of water", "Avoid harsh soaps that strip natural oils"],
        warning: "New or changing moles should be examined by a dermatologist."
    },
    smoking: {
        title: "🚭 Stop Smoking",
        tips: ["Set a quit date and stick to it", "Use nicotine patches or gum to manage cravings", "Avoid triggers: alcohol, coffee, certain social settings", "Join a support group or use a quit-smoking app"],
        warning: "Talk to your pharmacist about prescription stop-smoking medications."
    }
};

function showHealthInfo(key) {
    const data = healthData[key];
    if (!data) return;

    document.querySelectorAll(".menu-left li").forEach(li => li.classList.remove("active"));
    event.target.classList.add("active");

    const panel = document.getElementById("healthInfoPanel");
    panel.innerHTML = `
        <h3>${data.title}</h3>
        <ul class="health-tips">
            ${data.tips.map(t => `<li>✔ ${t}</li>`).join("")}
        </ul>
        <p class="health-warning">⚠️ ${data.warning}</p>
    `;
}

document.addEventListener("click", function (e) {
    const menu = document.getElementById("healthMenu");
    const trigger = document.querySelector(".dropdown");
    if (menu && trigger && !trigger.contains(e.target)) {
        menu.classList.remove("show");
    }
});

// SLIDER
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
setInterval(() => {
    slides.forEach(s => s.classList.remove("active"));
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
}, 3000);

// TOAST NOTIFICATION
function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// ADMIN PANEL (CRUD UI)
function openAdminPanel() {
    document.getElementById("adminPanel").classList.add("show");
    document.getElementById("adminOverlay").style.display = "block";
    renderAdminTable();
}

function closeAdminPanel() {
    document.getElementById("adminPanel").classList.remove("show");
    document.getElementById("adminOverlay").style.display = "none";
    resetForm();
}

function switchTab(tab) {
    document.querySelectorAll(".admin-tab").forEach(t => t.classList.add("hidden"));
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(`tab-${tab}`).classList.remove("hidden");
    event.target.classList.add("active");
    if (tab === "manage") renderAdminTable();
}

function renderAdminTable() {
    const keyword = (document.getElementById("adminSearch")?.value || "").toLowerCase();
    const products = getProducts().filter(p =>
        p.name.toLowerCase().includes(keyword) || p.category.toLowerCase().includes(keyword)
    );
    const tbody = document.getElementById("adminTableBody");
    document.getElementById("productCount").textContent = getProducts().length;

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;color:#999">No products found</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(p => `
        <tr>
            <td><span class="id-badge">#${p.id}</span></td>
            <td><strong>${p.name}</strong></td>
            <td><span class="cat-badge">${p.category}</span></td>
            <td>€${p.price}</td>
            <td>${p.discount ? `<span class="sale-yes">✓ Sale</span>` : `<span class="sale-no">—</span>`}</td>
            <td class="action-btns">
                <button class="edit-btn" onclick="editProduct(${p.id})">✏️ Edit</button>
                <button class="delete-btn" onclick="confirmDelete(${p.id}, '${p.name.replace(/'/g, "\\'")}')">🗑 Delete</button>
            </td>
        </tr>
    `).join("");
}

// ADMIN — CREATE
function saveProduct() {
    const name = document.getElementById("adminName").value.trim();
    const price = parseFloat(document.getElementById("adminPrice").value);
    const category = document.getElementById("adminCategory").value;
    const img = document.getElementById("adminImg").value.trim() || "images/placeholder.jpg";
    const discount = document.getElementById("adminDiscount").checked;
    const editId = document.getElementById("editId").value;

    if (!name || isNaN(price) || price < 0 || !category) {
        showAdminMsg("⚠️ Please fill in Name, Price, and Category.", "error");
        return;
    }

    if (editId) {

        const success = updateProduct(parseInt(editId), { name, price, category, img, discount });
        if (success) {
            showAdminMsg(`✅ "${name}" updated successfully!`, "success");
            resetForm();
            renderAdminTable();
            displayProducts(getProducts()); // refresh storefront
        }
    } else {

        const created = createProduct({ name, price, category, img, discount });
        showAdminMsg(`✅ "${created.name}" added with ID #${created.id}!`, "success");
        resetForm();
        renderAdminTable();
    }
}

// ADMIN — EDIT
function editProduct(id) {
    const product = getProducts().find(p => p.id === id);
    if (!product) return;

    document.querySelectorAll(".admin-tab").forEach(t => t.classList.add("hidden"));
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("tab-add").classList.remove("hidden");
    document.querySelector(".tab-btn").classList.add("active");

    document.getElementById("editId").value = product.id;
    document.getElementById("adminName").value = product.name;
    document.getElementById("adminPrice").value = product.price;
    document.getElementById("adminCategory").value = product.category;
    document.getElementById("adminImg").value = product.img;
    document.getElementById("adminDiscount").checked = product.discount;
    document.getElementById("formTitle").textContent = `✏️ Edit Product #${product.id}`;
}

// ADMIN — DELETE
function confirmDelete(id, name) {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
        deleteProduct(id);
        renderAdminTable();
        displayProducts(getProducts()); // refresh storefront
        showToast(`🗑 "${name}" deleted.`);
    }
}

function resetForm() {
    document.getElementById("editId").value = "";
    document.getElementById("adminName").value = "";
    document.getElementById("adminPrice").value = "";
    document.getElementById("adminCategory").value = "";
    document.getElementById("adminImg").value = "";
    document.getElementById("adminDiscount").checked = false;
    document.getElementById("formTitle").textContent = "Add New Product";
    document.getElementById("adminMsg").textContent = "";
}

function showAdminMsg(msg, type) {
    const el = document.getElementById("adminMsg");
    el.textContent = msg;
    el.className = `admin-msg ${type}`;
    setTimeout(() => { el.textContent = ""; el.className = "admin-msg"; }, 4000);
}

// INIT
updateCart();
