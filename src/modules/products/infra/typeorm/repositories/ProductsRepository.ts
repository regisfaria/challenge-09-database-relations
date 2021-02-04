import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = await this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id);

    const dbProducts = await this.ormRepository.find({
      where: {
        id: In(productsIds),
      },
    });

    return dbProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // const updatedProducts: Product[] = [];

    // products.forEach(async product => {
    //   await this.ormRepository
    //     .query(
    //       `UPDATE products SET quantity=${product.quantity} WHERE id=${product.id}`,
    //     )
    //     .then(async () => {
    //       const updatedProduct = await this.ormRepository.findOne(product.id);

    //       if (updatedProduct) {
    //         updatedProducts.push(updatedProduct);
    //       }
    //     });
    // });

    // return updatedProducts;
    const productsUpdated = await this.ormRepository.save(products);

    return productsUpdated;
  }
}

export default ProductsRepository;
