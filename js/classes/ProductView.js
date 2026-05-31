class ProductView {
    constructor(productService, cartService) {
        this.productService = productService;
        this.cartService = cartService;
    }

    displayProducts(list, scroll) {
        const $container = $("#productList");
        const $message = $("#emptyMsg");

        $container.empty();

        if (!list || list.length === 0) {
            $message.text("Nuk u gjet asnjë produkt.").show();
            return;
        }

        $message.hide();

        $.each(list, (index, product) => {
            $container.append(this.createProductCard(product));
        });

        if (scroll) {
            document.getElementById("productList").scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    createProductCard(product) {
        const discountedPrice = product.discount ? product.price + 3 : null;

        return $(`
            <div class="product" id="product-${product.id}">
                ${product.discount ? '<span class="badge">ULJE</span>' : ""}
                <img src="${product.img || PLACEHOLDER_IMAGE}" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}'" />
                <h4>${product.name}</h4>
                <p class="price">
                    ${product.discount ? "<del>&euro;" + discountedPrice + "</del> " : ""}
                    <strong>&euro;${product.price}</strong>
                </p>
                <div class="qty">
                    <button onclick="decreaseQty(${product.id})">-</button>
                    <span id="qty-${product.id}">1</span>
                    <button onclick="increaseQty(${product.id})">+</button>
                </div>
                <button onclick="addToCart(${product.id})">Shto në Shportë</button>
            </div>
        `);
    }

    filterCategory(category) {
        this.displayProducts(this.productService.filterByCategory(category), true);
    }

    searchProducts() {
        const keyword = $("#search").val().trim();

        if (!keyword) {
            this.displayProducts(this.productService.getProducts(), false);
            return;
        }

        this.displayProducts(this.productService.search(keyword), false);
    }

    showHome() {
        $("#productList").empty();
        $("#emptyMsg").text("Zgjidhni një kategori ose shikoni të gjitha produktet").show();
    }
}
