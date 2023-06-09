import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
import { logRequest, msg } from "../midleware/midleware.js";

const ProductManager1 = new ProductManager();

const prodRouter = Router();

prodRouter.use(msg);

prodRouter.get("/:id", logRequest, async (req, res) => {
  try {
    const prod = await ProductManager1.getProductById(req.params.id);
    if (!prod) {
      return res.send({ id: id, message: `id ${id} no encontrado ` });
    }
    res.send(prod);
  } catch (error) {
    console.error(error);
    res.status(404).send("Error id no encontrado");
  }
});

prodRouter.get("/", logRequest, async (req, res) => {
  try {
    const products = await ProductManager1.getProducts();
    const limit = parseInt(req.query.limit);
    if (limit) {
      const firstProducts = products.slice(0, limit);
      res.send(firstProducts);
      console.log(firstProducts);
    } else {
      res.send(products);
      console.log(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

prodRouter.post("/", logRequest, async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      res.status(400).send({
        message: "Faltan campos requeridos para agregar el producto.",
      });
      return;
    }
    await ProductManager1.addProduct(
      title,
      description,
      code,
      price,
      true,
      stock,
      category,
      thumbnails
    );
    res.send({ message: "Producto agregado exitosamente." });
    socketServer.emit("productAdded", product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

prodRouter.put("/:id", logRequest, async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;
    const { id } = req.params;
    const prod = await ProductManager1.getProductById(id);
    if (!prod) {
      return res
        .status(404)
        .send({ message: `Producto con ID ${id} no encontrado.` });
    }
    await ProductManager1.updateProduct(
      id,
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails
    );
    res.send({ message: "Producto actualizado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

prodRouter.delete("/:id", logRequest, async (req, res) => {
  try {
    const prodId = req.params.id;
    const prod = await ProductManager1.getProductById(prodId);
    if (!prod) {
      return res
        .status(404)
        .send({ message: `Producto con ID ${prodId} no encontrado.` });
    }
    await ProductManager1.deleteProd(prodId);
    res.send({ message: "Producto Eliminado exitosamente." });
    socketServer.emit("productDeleted", prodId);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

export default prodRouter;
