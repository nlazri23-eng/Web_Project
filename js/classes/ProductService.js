class ProductService {
    constructor(storage) {
        this.storage = storage;
    }

    initProducts() {
        $.get(`${API_BASE_URL}/products`)
            .done((data) => {
                this.saveProducts(data);
                console.log("Produktet u ngarkuan nga databaza");
            })
            .fail(() => {
                console.warn("Produktet nga databaza nuk u ngarkuan - po përdoren produktet lokale.");
                if (!localStorage.getItem(PRODUCT_STORAGE_KEY)) {
                    this.saveProducts(defaultProducts);
                }
            });
    }

    getProducts() {
        const products = this.storage.get(PRODUCT_STORAGE_KEY, null);
        if (products) return products;

        this.saveProducts(defaultProducts);
        return defaultProducts;
    }

    saveProducts(products) {
        this.storage.set(PRODUCT_STORAGE_KEY, products);
    }

    getNextId() {
        const products = this.getProducts();
        return products.length === 0 ? 1 : Math.max(...products.map((product) => product.id)) + 1;
    }

    async createProduct(product) {
        const created = await this.requestProductApi("POST", "products", product);
        this.saveProducts([...this.getProducts(), created]);
        return created;
    }

    async updateProduct(id, data) {
        const products = this.getProducts();
        const index = products.findIndex((product) => product.id === id);

        if (index === -1) return false;

        const updatedProduct = { ...products[index], ...data, id };
        await this.requestProductApi("PUT", `products/${id}`, updatedProduct);
        products[index] = updatedProduct;
        this.saveProducts(products);
        return true;
    }

    async deleteProduct(id) {
        await this.requestProductApi("DELETE", `products/${id}`);
        this.saveProducts(this.getProducts().filter((product) => product.id !== id));
    }

    findProduct(id) {
        return this.getProducts().find((product) => product.id === id);
    }

    search(keyword) {
        const searchText = keyword.trim().toLowerCase();

        if (!searchText) {
            return this.getProducts();
        }

        return this.getProducts().filter((product) =>
            String(product.name || "").toLowerCase().includes(searchText) ||
            String(product.category || "").toLowerCase().includes(searchText) ||
            String(product.price || "").includes(searchText)
        );
    }

    filterByCategory(category) {
        return this.getProducts().filter((product) => product.category === category);
    }

    async requestProductApi(method, path, body) {
        const token = this.storage.get(ADMIN_TOKEN_KEY, "");
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                "X-Admin-Token": token
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE_URL}/${path}`, options);

        if (!response.ok) {
            if (response.status === 401) {
                this.storage.remove(ADMIN_AUTH_KEY);
                this.storage.remove(ADMIN_TOKEN_KEY);
            }

            throw new Error(`Kërkesa e API-së për produktin dështoi me ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        return response.json();
    }

    async uploadProductImage(file) {
        const token = this.storage.get(ADMIN_TOKEN_KEY, "");
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`${API_BASE_URL}/uploads/product-image`, {
            method: "POST",
            headers: {
                "X-Admin-Token": token
            },
            body: formData
        });

        if (!response.ok) {
            if (response.status === 401) {
                this.storage.remove(ADMIN_AUTH_KEY);
                this.storage.remove(ADMIN_TOKEN_KEY);
            }

            throw new Error(`Ngarkimi i imazhit dështoi me ${response.status}`);
        }

        return response.json();
    }
}
