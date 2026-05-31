class CartService {
    constructor(storage, productService, toast) {
        this.storage = storage;
        this.productService = productService;
        this.toast = toast;
        this.cart = this.storage.get(CART_STORAGE_KEY, []);
        this.quantities = {};
    }

    saveCart() {
        this.storage.set(CART_STORAGE_KEY, this.cart);
    }

    addToCart(id) {
        const product = this.productService.findProduct(id);
        if (!product) return;

        const quantity = this.quantities[id] || 1;
        const existing = this.cart.find((item) => item.id === id);

        if (existing) {
            existing.qty += quantity;
        } else {
            this.cart.push({ ...product, qty: quantity });
        }

        this.saveCart();
        this.updateCart();
        this.toast.show(product.name + " u shtua në shportë");
        this.quantities[id] = 1;
        $("#qty-" + id).text(1);
    }

    increaseQty(id) {
        this.quantities[id] = (this.quantities[id] || 1) + 1;
        $("#qty-" + id).text(this.quantities[id]);
    }

    decreaseQty(id) {
        if (!this.quantities[id]) this.quantities[id] = 1;
        if (this.quantities[id] > 1) this.quantities[id]--;
        $("#qty-" + id).text(this.quantities[id]);
    }

    updateCart() {
        const $items = $("#cartItems");
        const $total = $("#total");
        const $count = $("#cartCount");
        let sum = 0;
        let totalItems = 0;

        $items.empty();

        if (this.cart.length === 0) {
            $items.append('<li class="cart-empty">Shporta juaj është bosh</li>');
        }

        $.each(this.cart, (index, item) => {
            sum += item.price * item.qty;
            totalItems += item.qty;
            $items.append(`
                <li class="cart-item">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong>
                        <span class="cart-item-qty">x${item.qty}</span>
                    </div>
                    <div class="cart-item-right">
                        <span>&euro;${(item.price * item.qty).toFixed(2)}</span>
                        <button class="remove-btn" onclick="removeFromCart(${index})">x</button>
                    </div>
                </li>
            `);
        });

        $total.text(sum.toFixed(2));
        $count.text(totalItems);
        $count.toggle(totalItems > 0);
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCart();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCart();
    }

    toggleCart() {
        $("#cartBox").toggleClass("show");
    }

    getCart() {
        return this.cart;
    }
}
