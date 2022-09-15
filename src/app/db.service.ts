import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

const headers = new HttpHeaders({'Content-Type': 'application/json'});
const fetchSearchDataUrl = `${environment.API_HOST}/api/sequences/search-data`;
const fetchClassesUrl = `${environment.API_HOST}/api/sequences/hierarchy`;
const fetchDescriptionsUrl = `${environment.API_HOST}/api/descriptions/fetch?term=`;
const fetchMechanismsUrl = `${environment.API_HOST}/api/sequences/mechanisms?class=`;
const fetchGroupUrl = `${environment.API_HOST}/api/sequences/groups?class=`;
const fetchFastaUrl = `${environment.API_HOST}/api/sequences/fasta?class=`;

const fetchFastaByClassUrl = `${environment.API_HOST}/api/sequences/byclass?class=`;
const fetchFastaByMechUrl = `${environment.API_HOST}/api/sequences/bymech?class=`;

@Injectable({
  providedIn: 'root'
})
export class DbService {
  
  constructor(private http: HttpClient) { }

  fetchClasses(): Promise<any[]> {
    return lastValueFrom(this.http.get<any[]>(fetchClassesUrl, { headers: headers }));
  }

  fetchDescriptionOfTerm(term: string): Promise<any> {
    const url = fetchDescriptionsUrl + encodeURIComponent(term)
    return lastValueFrom(this.http.get<any>(url, {headers: headers}));
  }

  fetchMechanismsOfClass(theClass: string): Promise<any> {
    const url = fetchMechanismsUrl + encodeURIComponent(theClass);
    return lastValueFrom(this.http.get<any>(url, {headers: headers}));
  }

  fetchGroupsOfClassAndMechanism(theClass: string, theMechanism: string): Promise<any> {
    const url = fetchGroupUrl + encodeURIComponent(theClass) + '&mechanism=' +  encodeURIComponent(theMechanism);
    return lastValueFrom(this.http.get<any>(url, {headers: headers}));
  }

  fetchFastaOfClass(theClass: string): Promise<any> {
    const url = fetchFastaByClassUrl + encodeURIComponent(theClass);      
    return lastValueFrom(this.http.get<any>(url, {headers: headers}));
  }

  fetchFastaOfClassAndMechanism(theClass: string, theMechanism: string): Promise<any> {
    const url = fetchFastaByMechUrl + 
      encodeURIComponent(theClass) + '&mechanism=' +  
      encodeURIComponent(theMechanism)
    return lastValueFrom(this.http.get<any>(url, {headers: headers}));
  }  

  fetchFastaOfClassAndMechanismAndGroup(theClass: string, theMechanism: string, theGroup: string): Promise<any> {
    const url = fetchFastaUrl + 
      encodeURIComponent(theClass) + '&mechanism=' +  
      encodeURIComponent(theMechanism) + '&group=' + encodeURIComponent(theGroup) ;
    return lastValueFrom(this.http.get<any>(url, {headers: headers}));
  }

  fetchSearchData(): Promise<any[]> {
    const url = fetchSearchDataUrl;
    return lastValueFrom(this.http.get<any[]>(url, {headers: headers}));
  }
}
