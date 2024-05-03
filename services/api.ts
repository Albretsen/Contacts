import { Contact } from "../types/Contact";

export const fetchContacts = async (token: string, searchQuery?: string) => {
    let url = 'https://test-api.softrig.com/api/biz/contacts?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress&hateoas=false';
    if (searchQuery) {
        url += `&filter=contains(Info.Name,'${encodeURIComponent(searchQuery)}')`;
    }

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status code: ${response.status}`);
    }
    return response.json();
};

export const fetchContact = async (token: string, id: string) => {
    let url = `https://test-api.softrig.com/api/biz/contacts/${id}?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress&hateoas=false`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status code: ${response.status}`);
    }
    return response.json();
};

export const createNewContact = async (token: string, contact: Contact | null) => {
    const response = await fetch('https://test-api.softrig.com/api/biz/contacts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error(`Network response was not ok. Status code: ${response.status}`);
    }
    return response.json();
}

export const deleteContact = async (token: string, id: string) => {
    const response = await fetch(`https://test-api.softrig.com/api/biz/contacts/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) {
        throw new Error(`Network response was not ok. Status code: ${response.status}`);
    }
    return true;
}

export const updateContact = async (token: string, contact: Contact) => {
    const response = await fetch(`https://test-api.softrig.com/api/biz/contacts/${contact.ID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contact),
    });
    if (!response.ok) {
        throw new Error(`Network response was not ok. Status code: ${response.status}`);
    }
    return response.json();
}