import { DataTypes, Model, ModelAttributeColumnOptions } from "sequelize";
import { Prestation, PrestationModel } from "../types/prestation";
import { DatabaseService } from "../service/storage";

describe.skip("PrestationModel", () => {
  it("should be correctly initialized from Sequelize instance", () => {
    const model =
      DatabaseService.getInstance().getSequelizeInstance().models.Prestation;

    expect(model).toBeDefined();

    expect(model.prototype instanceof Model).toBeTruthy();

    const attributes = model.getAttributes();

    const idAttribute = attributes.id as ModelAttributeColumnOptions;
    expect(idAttribute).toBeDefined();
    expect(idAttribute.type.valueOf()).toStrictEqual(DataTypes.INTEGER());
    expect(idAttribute.primaryKey).toBe(true);
    expect(idAttribute.autoIncrement).toBe(true);

    const nameAttribute = attributes.name as ModelAttributeColumnOptions;
    expect(nameAttribute).toBeDefined();
    expect(nameAttribute.type.valueOf()).toStrictEqual(DataTypes.STRING());
    expect(nameAttribute.allowNull).toBe(false);

    const bannerImageAttribute =
      attributes.bannerImage as ModelAttributeColumnOptions;
    expect(bannerImageAttribute).toBeDefined();
    expect(bannerImageAttribute.type).toStrictEqual(DataTypes.TEXT());
    expect(bannerImageAttribute.allowNull).toBe(false);

    const otherImageAttribute =
      attributes.otherImage as ModelAttributeColumnOptions;
    expect(otherImageAttribute).toBeDefined();
    expect(otherImageAttribute.type).toStrictEqual(DataTypes.STRING());
    expect(otherImageAttribute.allowNull).toBe(true);

    const descriptionAttribute =
      attributes.description as ModelAttributeColumnOptions;
    expect(descriptionAttribute).toBeDefined();
    expect(descriptionAttribute.type).toStrictEqual(DataTypes.TEXT());
    expect(descriptionAttribute.allowNull).toBe(true);
  });

  it("should have model registered in Sequelize instance", () => {
    // Check that the model is registered in Sequelize models
    expect(
      DatabaseService.getInstance().getSequelizeInstance().models.Prestation,
    ).toBeDefined();
    expect(
      DatabaseService.getInstance().getSequelizeInstance().models.Prestation,
    ).toBe(PrestationModel);
  });

  it("should create a model instance", () => {
    const testData = {
      id: 1,
      name: "Test Prestation",
      bannerImage: "test-banner.jpg",
      otherImage: "image1.jpg;image2.jpg",
      description: "Test description",
    } as Prestation;

    const prestationInstance = new PrestationModel(testData);

    // Verify instance creation
    expect(prestationInstance).toBeInstanceOf(PrestationModel);
    expect(prestationInstance.id).toBe(testData.id);
    expect(prestationInstance.name).toBe(testData.name);
    expect(prestationInstance.bannerImage).toBe(testData.bannerImage);
    expect(prestationInstance.otherImage).toEqual(testData.otherImage);
    expect(prestationInstance.description).toBe(testData.description);
  });

  it("should be associated with DatabaseService.getInstance()", () => {
    // Check that the model is initialized with the correct Sequelize instance
    expect(PrestationModel.sequelize).toBe(DatabaseService.getInstance());
  });

  it("should have correct model options", () => {
    // Verify model-level configurations
    expect(PrestationModel.options).toBeDefined();
    expect(PrestationModel.options.sequelize).toBe(
      DatabaseService.getInstance(),
    );
  });

  describe("query", () => { });
});
