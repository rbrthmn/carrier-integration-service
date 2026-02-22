import {CarrierOperations} from "./types";

export interface Carrier {
    readonly name: string;
    readonly code: string;  // 'ups', 'fedex', 'usps'
    operations: CarrierOperations;
}
