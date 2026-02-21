import { UPSOAuthClient } from "./auth/oauth-client";
import { UPSConfig } from "./config";
import {Carrier} from "../carrier";
import {CarrierOperations} from "../types";
import {HttpClient} from "../../http/client";

export class UPSCarrier implements Carrier {
  readonly name = 'United Parcel Service';
  readonly code = 'ups';
  
  operations: CarrierOperations;
  
  constructor(
    private readonly config: UPSConfig,
    private readonly httpClient: HttpClient
  ) {
    const authClient = new UPSOAuthClient(config, httpClient);
    this.operations = {
      getRates: (req) => new UPSRatingOperation(this.config, authClient, httpClient).execute(req)
    };
  }
}
