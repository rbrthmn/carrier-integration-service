import {UPSCodeDescription, UPSMeasurement, UPSMonetaryValue} from "./ups-shared-interfaces";
import {UPSTransactionReference} from "./ups-rating-request";

export interface UPSRateResponse {
    RateResponse: {
        Response: UPSResponseMetadata;
        RatedShipment: UPSRatedShipment[];
    };
}

export interface UPSResponseMetadata {
    ResponseStatus: UPSCodeDescription;
    Alert?: UPSCodeDescription[];
    AlertDetail?: UPSAlertDetail[];
    TransactionReference: UPSTransactionReference;
}

export interface UPSAlertDetail {
    Code: string;
    Description: string;
    ElementLevelInformation: {
        Level: string;
        ElementIdentifier: Array<{ Code: string | null; Value: string | null }>;
    };
}

export interface UPSRatedShipment {
    Disclaimer?: UPSCodeDescription[];
    Service: UPSCodeDescription;
    RateChart?: string;
    Zone?: string;
    RatedShipmentAlert?: UPSCodeDescription[];
    BillableWeightCalculationMethod?: string;
    RatingMethod?: string;
    BillingWeight: UPSMeasurement;
    TransportationCharges: UPSMonetaryValue;
    BaseServiceCharge: UPSMonetaryValue;
    ItemizedCharges?: UPSItemizedCharge[];
    FRSShipmentData?: UPSFRSShipmentData;
    ServiceOptionsCharges: UPSMonetaryValue;
    TaxCharges?: UPSTaxCharge[];
    TotalCharges: UPSMonetaryValue;
    TotalChargesWithTaxes: UPSMonetaryValue;
    NegotiatedRateCharges?: UPSNegotiatedRateCharges;
    RatedPackage: UPSRatedPackage[];
    TimeInTransit?: UPSTimeInTransit;
    GuaranteedDelivery?: UPSGuaranteedDelivery;
    RoarRatedIndicator?: string;
}

export interface UPSItemizedCharge extends UPSCodeDescription {
    CurrencyCode: string | null;
    MonetaryValue: string | null;
    SubType?: string | null;
}

export interface UPSTaxCharge {
    Type: string;
    MonetaryValue: string;
}

export interface UPSNegotiatedRateCharges {
    BaseServiceCharge: UPSMonetaryValue[];
    RateModifier: UPSRateModifier[];
    ItemizedCharges: UPSItemizedCharge[];
    TaxCharges: UPSTaxCharge[];
    TotalCharge: UPSMonetaryValue;
    TotalChargesWithTaxes: UPSMonetaryValue;
}

export interface UPSRateModifier {
    ModifierType: string | null;
    ModifierDesc: string | null;
    Amount: string | null;
}

export interface UPSRatedPackage {
    BaseServiceCharge: UPSMonetaryValue;
    TransportationCharges: UPSMonetaryValue;
    ServiceOptionsCharges: UPSMonetaryValue;
    TotalCharges: UPSMonetaryValue;
    Weight: string;
    BillingWeight: UPSMeasurement;
    Accessorial?: UPSCodeDescription[];
    ItemizedCharges?: UPSItemizedCharge[];
    NegotiatedCharges?: {
        RateModifier: any[];
        ItemizedCharges: any[];
    };
    SimpleRate?: { Code: string };
    RateModifier?: UPSRateModifier[];
}

export interface UPSTimeInTransit {
    PickupDate: string;
    DocumentsOnlyIndicator?: string;
    PackageBillType?: string;
    ServiceSummary: UPSServiceSummary;
    AutoDutyCode?: string;
    Disclaimer?: string;
}

export interface UPSServiceSummary {
    Service: { Description: string };
    GuaranteedIndicator?: string;
    Disclaimer?: string;
    EstimatedArrival: UPSEstimatedArrival;
    SaturdayDelivery?: string;
    SaturdayDeliveryDisclaimer?: string;
    SundayDelivery?: string;
    SundayDeliveryDisclaimer?: string;
}

export interface UPSEstimatedArrival {
    Arrival: { Date: string | null; Time: string | null };
    BusinessDaysInTransit: string;
    Pickup: { Date: string | null; Time: string | null };
    DayOfWeek: string;
    CustomerCenterCutoff?: string;
    DelayCount?: string;
    HolidayCount?: string;
    RestDays?: string;
    TotalTransitDays?: string;
}

export interface UPSGuaranteedDelivery {
    BusinessDaysInTransit: string;
    DeliveryByTime: string;
    ScheduledDeliveryDate: string;
}

export interface UPSFRSShipmentData {
    TransportationCharges: {
        GrossCharge: UPSMonetaryValue;
        DiscountAmount: UPSMonetaryValue;
        DiscountPercentage: string;
        NetCharge: UPSMonetaryValue;
    };
    FreightDensityRate: {
        Density: string;
        TotalCubicFeet: string;
    };
    HandlingUnits: UPSHandlingUnit[];
}

export interface UPSHandlingUnit {
    Quantity: string;
    Type: UPSCodeDescription;
    Dimensions: UPSMeasurement;
    AdjustedHeight: {
        Value: string | null;
        UnitOfMeasurement: any | null;
    };
}
