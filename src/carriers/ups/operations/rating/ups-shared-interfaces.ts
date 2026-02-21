export interface UPSCodeDescription {
    Code: string | null;
    Description: string | null;
}

export interface UPSAddress {
    AddressLine: string[];
    City: string;
    StateProvinceCode: string;
    PostalCode: string;
    CountryCode: string;
}

export interface UPSMonetaryValue {
    CurrencyCode: string;
    MonetaryValue: string;
}

export interface UPSMeasurement {
    UnitOfMeasurement: UPSCodeDescription;
    Weight?: string;
    Length?: string;
    Width?: string;
    Height?: string;
}
