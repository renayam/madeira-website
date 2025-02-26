import { DataTypes, Model, ModelAttributeColumnOptions } from "sequelize";
import { PortfolioItemModel } from "../types/portfolio";
import { DatabaseService } from "../service/storage";

describe("PortfolioItemModel", () => {
  it("should be correctly initialized from Sequelize instance", () => {
    const model = DatabaseService.getInstance().models.PortfolioItem;

    expect(model).toBeDefined();

    expect(model.prototype instanceof Model).toBeTruthy();

    const attributes = model.getAttributes();

    const idAttribute = attributes.id as ModelAttributeColumnOptions;
    expect(idAttribute).toBeDefined();
    expect(idAttribute.type.valueOf()).toStrictEqual(DataTypes.INTEGER());
    expect(idAttribute.primaryKey).toBe(true);
    expect(idAttribute.autoIncrement).toBe(true);

    const titleAttribute = attributes.title as ModelAttributeColumnOptions;
    expect(titleAttribute).toBeDefined();
    expect(titleAttribute.type.valueOf()).toStrictEqual(DataTypes.STRING());
    expect(titleAttribute.allowNull).toBe(false);

    const mainImageAttribute =
      attributes.mainImage as ModelAttributeColumnOptions;
    expect(mainImageAttribute).toBeDefined();
    expect(mainImageAttribute.type).toStrictEqual(DataTypes.STRING());
    expect(mainImageAttribute.allowNull).toBe(false);

    const galleryAttribute = attributes.gallery as ModelAttributeColumnOptions;
    expect(galleryAttribute).toBeDefined();
    expect(galleryAttribute.type).toStrictEqual(DataTypes.STRING());
    expect(galleryAttribute.allowNull).toBe(true);

    const descriptionAttribute =
      attributes.description as ModelAttributeColumnOptions;
    expect(descriptionAttribute).toBeDefined();
    expect(descriptionAttribute.type).toStrictEqual(DataTypes.TEXT());
    expect(descriptionAttribute.allowNull).toBe(true);

    const altTextAttribute = attributes.altText as ModelAttributeColumnOptions;
    expect(altTextAttribute).toBeDefined();
    expect(altTextAttribute.type).toStrictEqual(DataTypes.STRING());
    expect(altTextAttribute.allowNull).toBe(true);
  });

  it("should have model registered in Sequelize instance", () => {
    // Check that the model is registered in Sequelize models
    expect(DatabaseService.getInstance().models.PortfolioItem).toBeDefined();
    expect(DatabaseService.getInstance().models.PortfolioItem).toBe(
      PortfolioItemModel,
    );
  });

  it("should create a model instance", () => {
    const testData = {
      id: 1,
      title: "Test Portfolio Item",
      description: "Test description",
      mainImage: "test-main-image.jpg",
      gallery: "image1.jpg;image2.jpg",
      altText: "Test alt text",
    };

    const portfolioItemInstance = new PortfolioItemModel(testData);

    // Verify instance creation
    expect(portfolioItemInstance).toBeInstanceOf(PortfolioItemModel);
    expect(portfolioItemInstance.id).toBe(testData.id);
    expect(portfolioItemInstance.title).toBe(testData.title);
    expect(portfolioItemInstance.description).toBe(testData.description);
    expect(portfolioItemInstance.mainImage).toBe(testData.mainImage);
    expect(portfolioItemInstance.gallery).toEqual(testData.gallery);
    expect(portfolioItemInstance.altText).toBe(testData.altText);
  });

  it("should be associated with DatabaseService.getInstance()", () => {
    // Check that the model is initialized with the correct Sequelize instance
    expect(PortfolioItemModel.sequelize).toBe(DatabaseService.getInstance());
  });

  it("should have correct model options", () => {
    // Verify model-level configurations
    expect(PortfolioItemModel.options).toBeDefined();
    expect(PortfolioItemModel.options.sequelize).toBe(
      DatabaseService.getInstance(),
    );
  });

  describe("query", () => {});
});
