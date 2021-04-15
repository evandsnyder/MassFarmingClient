import { Address } from "./address.model";
import { IsA } from "./isA.model";
import { Schedule } from "./schedule.model";

export interface Farm{
    farmId: string;
    farmName: string;
    ownerName?: string;
    description?: string;
    isActive: boolean;
    doesDeliver: boolean;
    websiteUrl?: string;
    contactEmail?: string;
    isContactable: boolean;
    phoneNumber?: string;
    
    address: Address;

    categories?: IsA[];
    schedules?: Schedule[];
}