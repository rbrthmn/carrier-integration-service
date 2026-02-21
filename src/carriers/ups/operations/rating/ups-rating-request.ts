import {UPSAddress, UPSCodeDescription, UPSMeasurement} from "./ups-shared-interfaces";

export interface UPSTransactionReference {
    CustomerContext: string;
}

export interface UPSRateRequest {
    RateRequest: {
        Request: {
            TransactionReference: UPSTransactionReference;
        };
        Shipment: UPSShipment;
    };
}

export interface UPSShipment {
    Shipper: UPSShipper;
    ShipTo: UPSShipContact;
    ShipFrom: UPSShipContact;
    PaymentDetails: {
        ShipmentCharge: UPSShipmentCharge[];
    };
    Service: UPSCodeDescription;
    NumOfPieces: string;
    Package: UPSPackageRequest;
}

export interface UPSShipper extends UPSShipContact {
    ShipperNumber: string;
}

export interface UPSShipContact {
    Name: string;
    Address: UPSAddress;
}

export interface UPSShipmentCharge {
    Type: string;
    BillShipper: {
        AccountNumber: string;
    };
}

export interface UPSPackageRequest {
    SimpleRate?: UPSCodeDescription;
    PackagingType: UPSCodeDescription;
    Dimensions: UPSMeasurement;
    PackageWeight: UPSMeasurement;
}
