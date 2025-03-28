import { Sequelize } from "sequelize";
import { Vendor, associateVendorModel, initVendorModel } from "./vendor.model";
import { ServiceIndustry, initServiceIndustryModel, associateServiceIndustryModel } from "./serviceIndustry.model";
import { IndustryService, initIndustryServiceModel, associateIndustryServiceModel } from "./industryService.model";
import { VendorService, initVendorServiceModel, associateVendorServiceModel } from "./vendorService.model";

export const initVendorModels = (sequelize: Sequelize) => {
    // Initialize Vendor related models
    initVendorModel(sequelize);
    initServiceIndustryModel(sequelize);
    initIndustryServiceModel(sequelize);
    initVendorServiceModel(sequelize);

    return {
        Vendor,
        ServiceIndustry,
        IndustryService,
        VendorService
    }
}

export const associateVendorModels = (orm: any) => {
    // Associate Vendor related models
    associateVendorModel(orm);
    associateServiceIndustryModel(orm);
    associateIndustryServiceModel(orm);
    associateVendorServiceModel(orm);
}