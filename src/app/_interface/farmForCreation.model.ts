import { Address } from "./address.model";
import { FarmType } from "./farmType.model";
import { Schedule } from "./schedule.model";

export interface FarmForCreation{
    farmName: string;
    ownerName: string;
    description: string;
    doesDeliver: boolean;
    websiteUrl: string;
    contactEmail: string;
    isContactable: boolean;
    
    address: Address;

    categories?: FarmType[];
    schedules?: Schedule[];
}