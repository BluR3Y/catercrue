import { model } from "mongoose";
import { listingSchema } from "./listing.schema";
import { contractListingSchema } from "./contractListing.schema";
import { jobListingSchema } from "./jobListing.schema";
import { IListing, IJobListing, IContractListing } from "@/types";

export const listingModel = model<IListing>("Listing", listingSchema);

export const contractListingModel = listingModel.discriminator<IContractListing>("ContractListing", contractListingSchema);

export const jobListingModel = listingModel.discriminator<IJobListing>("JobListing", jobListingSchema);