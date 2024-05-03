export type Contact = {
    ID: string;
    /*InfoID: number;*/
    Info: {
        /*DefaultEmailID: number;
        DefaultPhoneID: number;
        InvoiceAddressID: number;*/
        Name: string;
        ID?: string;
        DefaultPhone: {
            ID: string;
            /*BusinessRelationID: number;*/
            CountryCode: string;
            /*Description: string;*/
            Number: string;
            /*Type: string;*/
        };
        DefaultEmail: {
            ID: string;
            /*BusinessRelationID: number;
            Deleted: boolean;
            Description: string | null;*/
            EmailAddress: string;
        };
        InvoiceAddress: {
            ID: string;
            AddressLine1: string;
            AddressLine2?: string;
            AddressLine3?: string;
            //BusinessRelationID: number;
            City: string;
            Country: string;
            //CountryCode: string;
            PostalCode: string;
            Region: string;
        };
    };
    /*Comment: string;*/
};