import { Contact } from "../types/Contact";

export const validateAndNormalizeContacts = (contacts: any[]): Contact[] => {
    return contacts.map((contact: any) => ({
        ID: contact.ID,
        Info: {
            Name: contact.Info.Name || '',
            ID: contact.Info.ID || '',
            DefaultPhone: {
                ID: contact.Info.DefaultPhone?.ID || '',
                CountryCode: contact.Info.DefaultPhone?.CountryCode || '',
                Number: contact.Info.DefaultPhone?.Number || '',
            },
            DefaultEmail: {
                ID: contact.Info.DefaultEmail?.ID || '',
                EmailAddress: contact.Info.DefaultEmail?.EmailAddress || '',
            },
            InvoiceAddress: {
                ID: contact.Info.InvoiceAddress?.ID || '',
                AddressLine1: contact.Info.InvoiceAddress?.AddressLine1 || '',
                AddressLine2: contact.Info.InvoiceAddress?.AddressLine2 || '',
                AddressLine3: contact.Info.InvoiceAddress?.AddressLine3 || '',
                City: contact.Info.InvoiceAddress?.City || '',
                Country: contact.Info.InvoiceAddress?.Country || '',
                PostalCode: contact.Info.InvoiceAddress?.PostalCode || '',
                Region: contact.Info.InvoiceAddress?.Region || '',
            },
        }
    }));
};

export const validateAndNormalizeContact = (contact: any): Contact => {
    return {
        ID: contact?.ID || '',
        Info: {
            Name: contact.Info?.Name || '',
            ID: contact.Info?.ID || '',
            DefaultPhone: {
                ID: contact.Info?.DefaultPhone?.ID || '',
                CountryCode: contact.Info?.DefaultPhone?.CountryCode || '',
                Number: contact.Info?.DefaultPhone?.Number || '',
            },
            DefaultEmail: {
                ID: contact.Info?.DefaultEmail?.ID || '',
                EmailAddress: contact.Info?.DefaultEmail?.EmailAddress || '',
            },
            InvoiceAddress: {
                ID: contact.Info?.InvoiceAddress?.ID || '',
                AddressLine1: contact.Info?.InvoiceAddress?.AddressLine1 || '',
                AddressLine2: contact.Info?.InvoiceAddress?.AddressLine2 || '',
                AddressLine3: contact.Info?.InvoiceAddress?.AddressLine3 || '',
                City: contact.Info?.InvoiceAddress?.City || '',
                Country: contact.Info?.InvoiceAddress?.Country || '',
                PostalCode: contact.Info?.InvoiceAddress?.PostalCode || '',
                Region: contact.Info?.InvoiceAddress?.Region || '',
            },
        }
    };
};