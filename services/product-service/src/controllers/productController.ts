import {Router} from 'express'
import { type DataSource } from 'typeorm'
import {Product} from "../models/Product";
import {MethodNotAllowedError, NotFound} from "../errors";

const generateLinkForProduct = (path: string, id: number) => {
  return `${path}/${id}`;
}

export const createProductController = (db: DataSource): Router => {
  const router = Router()

  router.post('/', async (req, res) => {
    const {name, description, price} = req.body;

    const productRepository = db.getRepository(Product)

    const product = productRepository.create({
      name,
      description,
      price,
      averageRating: 0,
      reviews: [],
    })

    const newProduct = await productRepository.save(product);

    res.status(201);
    res.setHeader('location', generateLinkForProduct(req.baseUrl, newProduct.id));
    res.send(newProduct);
  });

  router.get('/', async (req, res) => {
    const productRepository = db.getRepository(Product)

    const products = await productRepository.find();

    res.status(200);
    res.send(products);
  });

  router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);

    const productRepository = db.getRepository(Product)

    const product = await productRepository.findOneBy({id});

    if(!product) {
      return next(new NotFound());
    }

    res.status(200);
    res.send(product);
  });

  router.delete('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);

    const productRepository = db.getRepository(Product)

    const product = await productRepository.findOneBy({id});

    if(!product) {
      return next(new NotFound());
    }

    await productRepository.delete(product);

    res.sendStatus(200);
  })

  router.patch('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    const body = req.body;

    const productRepository = db.getRepository(Product)

    const product = await productRepository.findOneBy({id});

    if(!product) {
      return next(new NotFound());
    }

    const newProduct = await productRepository.save({id, ...body});

    res.status(200);
    res.send({
      ...product,
      ...newProduct,
    });
  });

  router.get(':id/reviews', () => {})

  router.use('', () => {
    throw new MethodNotAllowedError();
  })

  return router
}
