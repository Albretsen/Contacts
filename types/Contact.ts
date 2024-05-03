export type Phone = {
    ID: string;
    CountryCode: string;
    Number: string;
};

export type Email = {
    ID: string;
    EmailAddress: string;
};

export type Address = {
    ID: string;
    AddressLine1: string;
    AddressLine2?: string;
    AddressLine3?: string;
    City: string;
    Country: string;
    PostalCode: string;
    Region: string;
};

export type ContactInfo = {
    Name: string;
    ID?: string;
    DefaultPhone: Phone;
    DefaultEmail: Email;
    InvoiceAddress: Address;
};

export type Contact = {
    ID: string;
    Info: ContactInfo;
};
