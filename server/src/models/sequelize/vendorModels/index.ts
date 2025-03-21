import { Vendor, associateVendorModel, initVendorModel } from "./vendor.model";
import { VendorIndustry, associateVendorIndustryModel, initVendorIndustryModel } from "./vendorIndustry.model";
import { associateIndustryServiceModel, IndustryService, initIndustryServiceModel } from "./industryService.model";
import { VendorService, associateVendorServiceModel, initVendorServiceModel } from "./vendorService.model";
import { Sequelize } from "sequelize";

export const initVendorModels = (sequelize: Sequelize) => {
    // Initialize Vendor related models
    initVendorModel(sequelize);
    initVendorIndustryModel(sequelize);
    initIndustryServiceModel(sequelize);
    initVendorServiceModel(sequelize);

    return {
        Vendor,
        VendorIndustry,
        IndustryService,
        VendorService
    }
}

export const associateVendorModels = (orm: any) => {
    // Associate Vendor related models
    associateVendorModel(orm);
    associateVendorIndustryModel(orm);
    associateIndustryServiceModel(orm);
    associateVendorServiceModel(orm);
}