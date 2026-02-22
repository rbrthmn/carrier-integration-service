import { RateRequest } from "../../../domain/models/rate-request";
import {UPSPackageRequest, UPSRateRequest} from "../operations/rating/ups-rating-request";

export function toUPSRateRequest(domain: RateRequest): UPSRateRequest {
  return {
    RateRequest: {
      Request: {
        TransactionReference: {
          CustomerContext: "Rating Request"
        }
      },
      Shipment: {
        Shipper: {
          Name: "Main Shipper",
          ShipperNumber: "PLACEHOLDER_ID", 
          Address: mapAddressToUPS(domain.origin)
        },
        ShipTo: {
          Name: "recipient",
          Address: mapAddressToUPS(domain.destination)
        },
        ShipFrom: {
          Name: "main shipper",
          Address: mapAddressToUPS(domain.origin)
        },
        PaymentDetails: {
          ShipmentCharge: [
            {
              Type: "01",
              BillShipper: {
                AccountNumber: "PLACEHOLDER_ID"
              }
            }
          ]
        },
        Service: {
          Code: domain.serviceCode || "0",
          Description: "some service"
        },
        NumOfPieces: String(domain.packages.length),
        Package: mapPackageToUPS(domain.packages[0])
      }
    }
  };
}

function mapAddressToUPS(address: any) {
  return {
    AddressLine: [address.street1, address.street2].filter(Boolean),
    City: address.city,
    StateProvinceCode: address.state,
    PostalCode: address.postalCode,
    CountryCode: address.country
  };
}

function mapPackageToUPS(pkg: any): UPSPackageRequest {
  return {
    PackagingType: {
      Code: 'some code',
      Description: 'some description'
    },
    Dimensions: {
      UnitOfMeasurement: {
        Code: pkg.dimensions?.unit === 'CM' ? 'CM' : 'IN',
        Description: pkg.dimensions?.unit === 'CM' ? 'Centimeters' : 'Inches'
      },
      Length: String(pkg.dimensions?.length || '0'),
      Width: String(pkg.dimensions?.width || '0'),
      Height: String(pkg.dimensions?.height || '0')
    },
    PackageWeight: {
      UnitOfMeasurement: {
        Code: pkg.weight?.unit === 'KG' ? 'KGS' : 'LBS',
        Description: pkg.weight?.unit === 'KG' ? 'Kilograms' : 'Pounds'
      },
      Weight: String(pkg.weight?.value || '0')
    }
  };
}
