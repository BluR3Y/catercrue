import { Schema, model, Document, Types } from "mongoose";
import { IListing, listingSchema } from "./listing.schema";
import { contractListingSchema, IContractListing } from "./contractListing.schema";
import { IJobListing, jobListingSchema } from "./jobListing.schema";

export const listingModel = model<IListing>("Listing", listingSchema);

export const contractListingModel = listingModel.discriminator("ContractListing", contractListingSchema);

export const jobListingModel = listingModel.discriminator<IJobListing>("JobListing", jobListingSchema);