import { Address } from "./address.model";

export interface Farm{
    farmId: string;
    farmName: string;
    ownerName: string;
    isActive: boolean;
    doesDeliver: boolean;
    websiteURL: string;
    contactEmail: string;
    isContactable: boolean;
    address: Address;
}