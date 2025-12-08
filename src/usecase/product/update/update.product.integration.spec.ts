import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product 1", 100);

    await productRepository.create(product);

    const input = {
      id: "123",
      name: "Product 1 Updated",
      price: 200,
    };

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: "123",
      name: "Product 1 Updated",
      price: 200,
    });
  });

  it("should throw an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product 1", 100);

    await productRepository.create(product);

    const input = {
      id: "123",
      name: "",
      price: 200,
    };

    await expect(usecase.execute(input)).rejects.toThrow("Name is required");
  });

  it("should throw an error when price is less than zero", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product 1", 100);

    await productRepository.create(product);

    const input = {
      id: "123",
      name: "Product 1 Updated",
      price: -1,
    };

    await expect(usecase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});
