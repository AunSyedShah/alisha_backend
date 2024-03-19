// Helper function to serialize shop data
function serializeShops(shops) {
    return shops.map(shop => {
        const serializedShop = {
            _id: shop._id,
            name: shop.name,
            products: [],
            manager: {}
        };

        if (shop.products && shop.products.length > 0) {
            serializedShop.products = shop.products.map(product => ({
                _id: product._id,
                name: product.name,
                price: product.price,
                description: product.description
                // Include other properties you want to send for each product
            }));
        }

        if (shop.manager) {
            serializedShop.manager = {
                _id: shop.manager._id,
                username: shop.manager.username
            };
        }
        // console.log(serializedShop);
        return serializedShop;
    });
}

module.exports = {
    serializeShops
}
