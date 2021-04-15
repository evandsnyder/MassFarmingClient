import { Address } from "./address.model";
import { FarmType } from "./farmType.model";
import { IsAForCreation } from "./isAForCreation.model";
import { Schedule } from "./schedule.model";

export interface FarmForUpdate {
    farmId: string;
    farmName: string;
    ownerName: string;
    description: string;
    doesDeliver: boolean;
    websiteUrl: string;
    contactEmail: string;
    isContactable: boolean;
    isActive: boolean;
    
    address: Address;

    categories?: IsAForCreation[];
    schedules?: Schedule[];
}