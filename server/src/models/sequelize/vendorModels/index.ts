import { Sequelize } from "sequelize";
import { Vendor, associateVendorModel, initVendorModel } from "./vendor.model";
import { VendorIndustry, associateVendorIndustryModel, initVendorIndustryModel } from "./vendorIndustry.model";
import { IndustryService, initIndustryServiceModel, associateIndustryServiceModel } from "./industryService.model";
import { VendorService, initVendorServiceModel, associateVendorServiceModel } from "./vendorService.model";

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