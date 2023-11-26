const Product = require('../models/product');

// function to show all the products
module.exports.products = function(req, res){
    Product.find({})
        .then(foundProducts => {
            res.send(foundProducts);
        })
        .catch(err => {
            res.send(err);
        });
};


// function to create a new product
module.exports.create = function(req, res){
    const newProduct = new Product({
        name: req.body.name,
        quantity: req.body.quantity
    });
    newProduct.save()
        .then(() => {
            res.send('New product added successfully.');
        })
        .catch(err => {
            res.send(err);
        });
}

// function to delete a product using it's ID
module.exports.delete = function(req, res){
    Product.deleteOne({_id: req.params.productID})
        .then(result => {
            if (result.deletedCount > 0) {
                res.send({
                    message: "Product deleted"
                });
            } else {
                res.send({
                    message: "Product not found"
                });
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
}


// function to update a product's quantity
module.exports.updateQunatity = function (req, res) {
    const ID = req.params.productID;
    
    // find the product using id
    Product.findById(ID)
        .then(found => {
            if (!found) {
                return res.status(404).send({ message: 'Product not found' });
            }

            // Note - To increment the quantity of the product put the number as a positive value in the query 
            // and to decrement the quantity put the number as a negative value in the query

            const newQty = parseInt(found.quantity) + parseInt(req.query.number);

            // update the product's quantity
            return Product.findByIdAndUpdate(ID, { quantity: newQty }, { new: true });
        })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).send({ message: 'Product not found' });
            }

            res.send({
                product: updatedProduct,
                message: 'Updated successfully'
            });
        })
        .catch(err => {
            res.status(500).send(err);
        });
};
