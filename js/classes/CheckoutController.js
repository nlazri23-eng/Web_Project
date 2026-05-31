class CheckoutController {
    constructor(storage, cartService, toast) {
        this.storage = storage;
        this.cartService = cartService;
        this.toast = toast;
    }

    showPayment() {
        const cart = this.cartService.getCart();

        if (cart.length === 0) {
            this.toast.show("Shporta juaj është bosh!");
            return;
        }

        const rows = cart.map((item) => `
            <div class="summary-row">
                <span>${item.name} x${item.qty}</span>
                <span>&euro;${(item.price * item.qty).toFixed(2)}</span>
            </div>
        `).join("");
        const total = this.getTotal().toFixed(2);

        $("#orderSummaryBox").html(`
            <div class="summary-title">Përmbledhja e Porosisë</div>
            ${rows}
            <div class="summary-row summary-total"><span>Totali</span><span>&euro;${total}</span></div>
        `);

        $("#checkoutStep1").show();
        $("#checkoutStep2").hide();
        $("#stepDot1").addClass("active");
        $("#stepDot2").removeClass("active");
        $("#paymentBox").show();
        $("#paymentOverlay").show();
    }

    goToStep2() {
        const first = $("#userFirstName").val().trim();
        const last = $("#userLastName").val().trim();
        const email = $("#userEmail").val().trim();
        const phone = $("#userPhone").val().trim();
        const address = $("#userAddress").val().trim();

        if (!first || !last || !email || !phone || !address) {
            this.toast.show("Ju lutemi plotësoni të gjitha të dhënat.");
            return;
        }

        if (!email.includes("@")) {
            this.toast.show("Ju lutemi shkruani një email të vlefshëm.");
            return;
        }

        $("#greetingName").text(first + " " + last);
        $("#cardName").val(first + " " + last);
        $("#checkoutStep1").hide();
        $("#checkoutStep2").show();
        $("#stepDot1").removeClass("active");
        $("#stepDot2").addClass("active");
    }

    goBackToStep1() {
        $("#checkoutStep1").show();
        $("#checkoutStep2").hide();
        $("#stepDot1").addClass("active");
        $("#stepDot2").removeClass("active");
    }

    closePayment() {
        $("#paymentBox").hide();
        $("#paymentOverlay").hide();
    }

    async payNow() {
        const number = $("#cardNumber").val().trim();
        const name = $("#cardName").val().trim();
        const expiry = $("#cardExpiry").val().trim();
        const cvv = $("#cardCvv").val().trim();

        if (!number || !name || !expiry || !cvv) {
            this.toast.show("Ju lutemi plotësoni të gjitha të dhënat e kartës.");
            return;
        }

        try {
            await this.saveOrder();
            this.closePayment();
            this.toast.show("Pagesa u krye me sukses! Faleminderit për porosinë.");
            this.cartService.clearCart();
            $("#cartBox").removeClass("show");
        } catch (error) {
            console.error("Ruajtja e porosisë dështoi", error);
            this.toast.show("Pagesa nuk u ruajt. Ju lutemi provoni përsëri.");
        }
    }

    async saveOrder() {
        const cart = this.cartService.getCart();

        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: $("#userFirstName").val().trim(),
                lastName: $("#userLastName").val().trim(),
                email: $("#userEmail").val().trim(),
                phone: $("#userPhone").val().trim(),
                address: $("#userAddress").val().trim(),
                items: cart.map((item) => ({
                    productId: item.id,
                    productName: item.name,
                    qty: item.qty,
                    quantity: item.qty,
                    price: item.price
                }))
            })
        });

        if (!response.ok) {
            throw new Error(`Kërkesa e API-së për porosinë dështoi me ${response.status}`);
        }

        return response.json();
    }

    getTotal() {
        return this.cartService.getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
    }
}
