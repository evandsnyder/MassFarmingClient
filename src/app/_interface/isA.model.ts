import { FarmType } from "./farmType.model";

export interface IsA{
    id: string;
    farmId: string;
    farmTypeId: string;
    farmType: FarmType;
}