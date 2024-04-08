import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  const { name, category, price, imgURL } = req.body;

  try {
    
    const newProduct = new Product({
      name,
      category,
      price,
      imgURL,
    });

    const productSaved = await newProduct.save();

    res.status(201).json(productSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  res.status(200).json(product);
};

export const getProducts = async (req, res) => {
  const products = await Product.find();
  return res.json(products);
};

export const updateProductById = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body,
    {
      new: true,
    }
  );
  res.status(204).json(updatedProduct);
};

export const deleteProductById = async (req, res) => {
  const { productId } = req.params;

  await Product.findByIdAndDelete(productId);

  // code 200 is ok too
  res.status(204).json();
};

export const getProductsByName=async(req,res)=>{
  console.log("INGRESO PRODUCT BY NAME  ")
  /*
  try{
    const {name}=req.params
    
    const products = await Product.find();
    console.log(products)
    const filteredProducts = products.filter(
      (product) => product.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(filteredProducts);
  }catch(error){
    return res.status(500).json({ error: "Se produjo un error al obtener los productos" });
  }
  */
}

export const getProductsByRangePrice=async(req,res)=>{
  try{
    const { minPrice, maxPrice } = req.params;
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ error: "Los parámetros minPrice y maxPrice deben ser números" });
    }
    const products = await Product.find();
    const filteredProducts = products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
    return res.json(filteredProducts);

  }catch(error){
    return res.status(500).json({ error: "Se produjo un error al obtener los productos" });
  }
}