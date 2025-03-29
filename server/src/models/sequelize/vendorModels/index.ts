import { Sequelize } from "sequelize";
import { Vendor, associateVendorModel, initVendorModel } from "./vendor.model";
import { ServiceIndustry, initServiceIndustryModel, associateServiceIndustryModel } from "./serviceIndustry.model";
import { IndustryService, initIndustryServiceModel, associateIndustryServiceModel } from "./industryService.model";
import { VendorService, initVendorServiceModel, associateVendorServiceModel } from "./vendorService.model";
import { Coordinator, initCoordinatorModel, associateCoordinatorModel } from "./coordinator.model";

export const initVendorModels = (sequelize: Sequelize) => {
    // Initialize Vendor related models
    initCoordinatorModel(sequelize);
    initVendorModel(sequelize);
    initServiceIndustryModel(sequelize);
    initIndustryServiceModel(sequelize);
    initVendorServiceModel(sequelize);

    return {
        Coordinator,
        Vendor,
        ServiceIndustry,
        IndustryService,
        VendorService
    }
}

export const associateVendorModels = (orm: any) => {
    // Associate Vendor related models
    associateCoordinatorModel(orm);
    associateVendorModel(orm);
    associateServiceIndustryModel(orm);
    associateIndustryServiceModel(orm);
    associateVendorServiceModel(orm);
}