import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageUtilityService {
    PAGES_STATE: string = 'pages-state';
    WIDGETS: string = 'widgets';
    
    constructor() { }

    add(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    get(key: string) {
        const value = localStorage.getItem(key);
        return value !== null && value !== '' ? JSON.parse(value) : null;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
}
