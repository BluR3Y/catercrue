import { Schema, model, Document, Types } from "mongoose";
import { IListing, listingSchema } from "./listing.schema";
import { contractListingSchema, IContractListing } from "./contractListing.schema";
import { IJobListing, jobListingSchema } from "./jobListing.schema";

export const listingModel = model<IListing>("Listing", listingSchema);

export const contractListingModel = model<IContractListing>("ContractListing", contractListingSchema);

export const jobListingModel = model<IJobListing>("JobListing", jobListingSchema);