import { Contact } from "../types/Contact";

export const updateContactObj = (originial_contact: Contact, new_contact: any) => {
    return {
    ID: originial_contact.ID,
    Info: {
        ...originial_contact.Info,
        Name: new_contact.name,
        DefaultPhone: {
            ...originial_contact.Info.DefaultPhone,
            CountryCode: new_contact.phone.split(' ')[0],
            Number: new_contact.phone.split(' ')[1]
        },
        DefaultEmail: {
            ...originial_contact.Info.DefaultEmail,
            EmailAddress: new_contact.email
        },
        InvoiceAddress: {
            ...originial_contact.Info.InvoiceAddress,
            AddressLine1: new_contact.address1,
            AddressLine2: new_contact.address2,
            AddressLine3: new_contact.address3,
            PostalCode: new_contact.postalCode,
            City: new_contact.city,
            Country: new_contact.country,
            Region: new_contact.region
        }
    }
}
};