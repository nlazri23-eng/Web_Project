class PharmaCareApp {
    constructor() {
        this.storage = new StorageService();
        this.toast = new Toast();
        this.productService = new ProductService(this.storage);
        this.cartService = new CartService(this.storage, this.productService, this.toast);
        this.productView = new ProductView(this.productService, this.cartService);
        this.checkout = new CheckoutController(this.storage, this.cartService, this.toast);
        this.healthAdvice = new HealthAdviceController(healthData);
        this.slider = new SliderController();
        this.admin = new AdminController(this.storage, this.productService, this.productView, this.toast);
    }

    init() {
        this.productService.initProducts();
        this.cartService.updateCart();
        this.slider.initSlider();
        this.healthAdvice.initOutsideClick();
        this.exposeGlobalFunctions();
    }

    exposeGlobalFunctions() {
        window.getProducts = () => this.productService.getProducts();
        window.saveProducts = (products) => this.productService.saveProducts(products);
        window.createProduct = (product) => this.productService.createProduct(product);
        window.updateProduct = (id, data) => this.productService.updateProduct(id, data);
        window.deleteProduct = (id) => this.productService.deleteProduct(id);

        window.displayProducts = (list, scroll) => this.productView.displayProducts(list, scroll);
        window.filterCategory = (category) => this.productView.filterCategory(category);
        window.searchProducts = () => this.productView.searchProducts();
        window.showHome = () => this.productView.showHome();

        window.addToCart = (id) => this.cartService.addToCart(id);
        window.increaseQty = (id) => this.cartService.increaseQty(id);
        window.decreaseQty = (id) => this.cartService.decreaseQty(id);
        window.updateCart = () => this.cartService.updateCart();
        window.removeFromCart = (index) => this.cartService.removeFromCart(index);
        window.toggleCart = () => this.cartService.toggleCart();

        window.showPayment = () => this.checkout.showPayment();
        window.goToStep2 = () => this.checkout.goToStep2();
        window.goBackToStep1 = () => this.checkout.goBackToStep1();
        window.closePayment = () => this.checkout.closePayment();
        window.payNow = () => this.checkout.payNow();
        window.saveOrder = () => this.checkout.saveOrder();

        window.toggleHealthMenu = () => this.healthAdvice.toggleHealthMenu();
        window.showHealthInfo = (key) => this.healthAdvice.showHealthInfo(key);

        window.openAdminPanel = () => this.admin.openAdminPanel();
        window.closeAdminPanel = () => this.admin.closeAdminPanel();
        window.closeAdminLogin = () => this.admin.closeAdminLogin();
        window.loginAdmin = () => this.admin.loginAdmin();
        window.logoutAdmin = () => this.admin.logoutAdmin();
        window.switchTab = (tab) => this.admin.switchTab(tab);
        window.renderAdminTable = () => this.admin.renderAdminTable();
        window.saveProduct = () => this.admin.saveProduct();
        window.editProduct = (id) => this.admin.editProduct(id);
        window.confirmDelete = (id, name) => this.admin.confirmDelete(id, name);
        window.renderOrders = () => this.admin.renderOrders();
        window.clearAllOrders = () => this.admin.clearAllOrders();
        window.resetForm = () => this.admin.resetForm();

        window.showToast = (message) => this.toast.show(message);
    }
}
