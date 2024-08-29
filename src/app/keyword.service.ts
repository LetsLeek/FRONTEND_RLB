import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Keyword } from './keyword';
import { Person } from './person';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class KeywordService {
  private keywordUrl = 'http://localhost:8080/api/keywords';
  private personUrl = 'http://localhost:8080/api/persons';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  async getAllKeywords(): Promise<Keyword[]> {
    try {
      const keywords = await this.http.get<Keyword[]>(this.keywordUrl).toPromise();
      console.log(keywords)
      return keywords ?? [];
    } catch (err) {
      this.toastr.error('Error fetching keywords');
      return [];
    }
  }

  async getAllPersons(department: string): Promise<Person[]> {
    try {
      switch (department.toUpperCase()) {
        case 'IT':
          return await this.http.get<Person[]>(`${this.personUrl}?dep=IT`).toPromise() ?? [];
        case 'NET':
          return await this.http.get<Person[]>(`${this.personUrl}?dep=NET`).toPromise() ?? [];
        case 'PROD':
        case 'PRODUKTION':
          return await this.http.get<Person[]>(`${this.personUrl}?dep=Produktion`).toPromise() ?? [];
        default:
          throw new Error('Invalid department');
      }
    } catch (err) {
      this.toastr.error('Error fetching persons', 'Error');
      return [];
    }
  }

  async addKeyword(keyword: Keyword): Promise<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    try {
      await this.http
        .post<Keyword>(this.keywordUrl, keyword, { headers })
        .toPromise();
      this.toastr.success('Keyword successfully created');
    } catch (error) {
      console.error('Error creating keyword:', error);
      this.toastr.error('Error creating keyword');
    }
  }

  async deleteKeyword(keyword: Keyword): Promise<void> {
    try {
      await this.http.delete<Keyword>(`${this.keywordUrl}/${keyword.id}`).toPromise();
      this.toastr.success('Keyword successfully deleted');
    } catch(err) {
      console.error('Error deleting keyword', err);
      this.toastr.error('Error deleting keyword');
    }
  }
  

  async updateKeyword(updatedKeyword: Keyword): Promise<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    try {
      await this.http
        .put<Keyword>(`${this.keywordUrl}/${updatedKeyword.id}`, updatedKeyword, { headers })
        .toPromise();
      this.toastr.success('Keyword successfully updated'); // Optional: Erfolgsmeldung anzeigen
    } catch (error) {
      this.toastr.error('Error updating keyword', 'Error');
      throw error; // Fehler weiterwerfen
    }
  }
  
  

  async submitApplication(
    name: string,
    department: string,
    responsiblePersons: Person[],
    control: string
  ): Promise<void> {
    const body: Keyword = {
      id: null,
      name,
      responsiblePersons,
      control,
      checkedBy: undefined,
      department,
    };
  
    try {
      await this.addKeyword(body);
    } catch (error) {
      // Handle the error if needed
      console.error('Error submitting application:', error);
    }
  }

}
