class AdminController {
    constructor(storage, productService, productView, toast) {
        this.storage = storage;
        this.productService = productService;
        this.productView = productView;
        this.toast = toast;
        this.authKey = ADMIN_AUTH_KEY;
        this.tokenKey = ADMIN_TOKEN_KEY;
    }

    openAdminPanel() {
        if (!this.isLoggedIn()) {
            this.openAdminLogin();
            return;
        }

        $("#adminPanel").addClass("show");
        $("#adminOverlay").show();
        this.renderAdminTable();
    }

    closeAdminPanel() {
        $("#adminPanel").removeClass("show");
        $("#adminLoginBox").removeClass("show");
        $("#adminOverlay").hide();
        $("#adminUsername, #adminPassword").val("");
        $("#adminLoginMsg").text("").attr("class", "admin-login-msg");
        this.resetForm();
    }

    openAdminLogin() {
        $("#adminOverlay").show();
        $("#adminLoginBox").addClass("show");
        $("#adminLoginMsg").text("").attr("class", "admin-login-msg");
        $("#adminUsername, #adminPassword").off("keydown.adminLogin").on("keydown.adminLogin", (event) => {
            if (event.key === "Enter") this.loginAdmin();
        });
        setTimeout(function () {
            $("#adminUsername").trigger("focus");
        }, 100);
    }

    closeAdminLogin() {
        $("#adminLoginBox").removeClass("show");
        $("#adminOverlay").hide();
        $("#adminUsername, #adminPassword").val("");
        $("#adminLoginMsg").text("").attr("class", "admin-login-msg");
    }

    async loginAdmin() {
        const username = $("#adminUsername").val().trim();
        const password = $("#adminPassword").val();

        if (!username || !password) {
            $("#adminLoginMsg").text("Shkruani emrin e përdoruesit dhe fjalëkalimin.").attr("class", "admin-login-msg error");
            return;
        }

        $("#adminLoginMsg").text("Duke kontrolluar hyrjen...").attr("class", "admin-login-msg");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.token) {
                $("#adminLoginMsg").text("Emri i përdoruesit ose fjalëkalimi është i gabuar.").attr("class", "admin-login-msg error");
                return;
            }

            this.storage.set(this.authKey, true);
            this.storage.set(this.tokenKey, result.token);
            this.closeAdminLogin();
            this.openAdminPanel();
            this.toast.show("Hyrja e adminit u krye me sukses.");
        } catch (error) {
            console.error("Hyrja e adminit dështoi", error);
            $("#adminLoginMsg").text("Nuk mund të lidhet me backend-in.").attr("class", "admin-login-msg error");
        }
    }

    logoutAdmin() {
        this.storage.remove(this.authKey);
        this.storage.remove(this.tokenKey);
        this.closeAdminPanel();
        this.toast.show("Admini doli nga llogaria.");
    }

    isLoggedIn() {
        return this.storage.get(this.authKey, false) === true && !!this.storage.get(this.tokenKey, "");
    }

    switchTab(tab) {
        $(".admin-tab").addClass("hidden");
        $(".tab-btn").removeClass("active");
        $("#tab-" + tab).removeClass("hidden");

        if (window.event && window.event.target) {
            $(window.event.target).addClass("active");
        }

        if (tab === "manage") this.renderAdminTable();
        if (tab === "orders") this.renderOrders();
    }

    renderAdminTable() {
        const keyword = ($("#adminSearch").val() || "").toLowerCase();
        const products = this.productService.getProducts().filter((product) =>
            product.name.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword)
        );

        $("#productCount").text(this.productService.getProducts().length);

        if (products.length === 0) {
            $("#adminTableBody").html('<tr><td colspan="6" style="text-align:center;padding:20px;color:#999">Nuk u gjet asnjë produkt</td></tr>');
            return;
        }

        $("#adminTableBody").html(products.map((product) => `
            <tr>
                <td><span class="id-badge">#${product.id}</span></td>
                <td><strong>${product.name}</strong></td>
                <td><span class="cat-badge">${getCategoryLabel(product.category)}</span></td>
                <td>&euro;${product.price}</td>
                <td>${product.discount ? '<span class="sale-yes">Ulje</span>' : '<span class="sale-no">-</span>'}</td>
                <td class="action-btns">
                    <button class="edit-btn" onclick="editProduct(${product.id})">Ndrysho</button>
                    <button class="delete-btn" onclick="confirmDelete(${product.id}, '${product.name.replace(/'/g, "\\'")}')">Fshi</button>
                </td>
            </tr>
        `).join(""));
    }

    async saveProduct() {
        const name = $("#adminName").val().trim();
        const price = parseFloat($("#adminPrice").val());
        const category = $("#adminCategory").val();
        const imageFile = $("#adminImg")[0].files[0];
        let img = $("#currentAdminImg").val() || "images/placeholder.jpg";
        const discount = $("#adminDiscount").prop("checked");
        const editId = $("#editId").val();

        if (!name || isNaN(price) || price < 0 || !category) {
            this.showAdminMsg("Ju lutemi plotësoni emrin, çmimin dhe kategorinë.", "error");
            return;
        }

        if (imageFile) {
            try {
                const upload = await this.productService.uploadProductImage(imageFile);
                img = upload.img;
            } catch (error) {
                console.error("Ngarkimi i imazhit dështoi", error);
                this.showAdminMsg("Ngarkimi i imazhit dështoi.", "error");
                return;
            }
        }

        if (editId) {
            try {
                if (await this.productService.updateProduct(parseInt(editId, 10), { name, price, category, img, discount })) {
                    this.showAdminMsg('"' + name + '" u përditësua me sukses!', "success");
                    this.resetForm();
                    this.renderAdminTable();
                    this.productView.displayProducts(this.productService.getProducts());
                }
            } catch (error) {
                console.error("Përditësimi i produktit dështoi", error);
                this.showAdminMsg("Vetëm admini i kyçur mund të përditësojë produktet.", "error");
            }
            return;
        }

        try {
            const created = await this.productService.createProduct({ name, price, category, img, discount });
            this.showAdminMsg('"' + created.name + '" u shtua me ID #' + created.id + "!", "success");
            this.resetForm();
            this.renderAdminTable();
            this.productView.displayProducts(this.productService.getProducts());
        } catch (error) {
            console.error("Krijimi i produktit dështoi", error);
            this.showAdminMsg("Vetëm admini i kyçur mund të shtojë produkte.", "error");
        }
    }

    editProduct(id) {
        const product = this.productService.findProduct(id);
        if (!product) return;

        $(".admin-tab").addClass("hidden");
        $(".tab-btn").removeClass("active");
        $("#tab-add").removeClass("hidden");
        $(".tab-btn:first").addClass("active");
        $("#editId").val(product.id);
        $("#adminName").val(product.name);
        $("#adminPrice").val(product.price);
        $("#adminCategory").val(product.category);
        $("#adminImg").val("");
        $("#currentAdminImg").val(product.img || "");
        $("#adminImgCurrent").text(product.img ? "Imazhi aktual është ruajtur" : "");
        $("#adminDiscount").prop("checked", product.discount);
        $("#formTitle").text("Ndrysho Produktin #" + product.id);
    }

    async confirmDelete(id, name) {
        if (!confirm('Të fshihet "' + name + '"? Ky veprim nuk mund të zhbëhet.')) return;

        try {
            await this.productService.deleteProduct(id);
            this.renderAdminTable();
            this.productView.displayProducts(this.productService.getProducts());
            this.toast.show('"' + name + '" u fshi.');
        } catch (error) {
            console.error("Fshirja e produktit dështoi", error);
            this.toast.show("Vetëm admini i kyçur mund të fshijë produkte.");
        }
    }

    async renderOrders() {
        let orders = [];

        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                headers: {
                    "X-Admin-Token": this.storage.get(this.tokenKey, "")
                }
            });

            if (!response.ok) throw new Error(`Kërkesa e API-së për porositë dështoi me ${response.status}`);
            orders = await response.json();
        } catch (error) {
            console.error("Ngarkimi i porosive dështoi", error);
            $("#ordersList").html('<p style="text-align:center;color:#999;padding:40px 0;">Porositë nuk mund të ngarkohen.</p>');
            return;
        }

        $("#ordersCount").text(orders.length);

        if (orders.length === 0) {
            $("#ordersList").html('<p style="text-align:center;color:#999;padding:40px 0;">Ende nuk ka porosi.</p>');
            return;
        }

        $("#ordersList").html(orders.map((order) => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">#${String(order.id).slice(-6)}</span>
                        <span class="order-date">${order.date}</span>
                    </div>
                    <span class="order-total">&euro;${order.total}</span>
                </div>
                <div class="order-customer">
                    <span>${order.customer.firstName} ${order.customer.lastName}</span>
                    <span>${order.customer.email}</span>
                    <span>${order.customer.phone}</span>
                    <span>${order.customer.address || ""}</span>
                </div>
                <div class="order-items">
                    ${order.items.map((item) => "<span class='order-item'>" + item.name + " x" + item.qty + " - &euro;" + (item.price * item.qty).toFixed(2) + "</span>").join("")}
                </div>
            </div>
        `).join(""));
    }

    async clearAllOrders() {
        if (!confirm("Të fshihen të gjitha porositë? Ky veprim nuk mund të zhbëhet.")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: "DELETE",
                headers: {
                    "X-Admin-Token": this.storage.get(this.tokenKey, "")
                }
            });

            if (!response.ok) throw new Error(`Fshirja e porosive dështoi me ${response.status}`);
            await this.renderOrders();
            this.toast.show("Të gjitha porositë u fshinë.");
        } catch (error) {
            console.error("Pastrimi i porosive dështoi", error);
            this.toast.show("Porositë nuk mund të fshihen.");
        }
    }

    resetForm() {
        $("#editId, #adminName, #adminPrice, #adminCategory, #adminImg, #currentAdminImg").val("");
        $("#adminImgCurrent").text("");
        $("#adminDiscount").prop("checked", false);
        $("#formTitle").text("Shto Produkt të Ri");
        $("#adminMsg").text("").attr("class", "admin-msg");
    }

    showAdminMsg(message, type) {
        $("#adminMsg").text(message).attr("class", "admin-msg " + type);
        setTimeout(function () {
            $("#adminMsg").text("").attr("class", "admin-msg");
        }, 4000);
    }
}
