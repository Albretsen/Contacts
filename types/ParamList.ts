import { Contact } from "./Contact";

export type ParamList = {
    Home: undefined;
    View: { contact: Contact }; 
    Edit: { contact: Contact }; 
    "New contact": undefined;
    "Sign in": undefined;
};