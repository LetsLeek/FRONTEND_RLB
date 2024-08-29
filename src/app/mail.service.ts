import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mail } from './mail';
import { CheckService } from './check.service'; // Import CheckService
import { Check } from './check'; // Import Check
import { Keyword } from './keyword'; // Import Keyword

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private mailUrl = 'http://localhost:8080/api/mails';

  constructor(private http: HttpClient, private checkService: CheckService) {}

  async getInboxMails(): Promise<Mail[]> {
    try {
      const mails = await this.http.get<Mail[]>(this.mailUrl).toPromise();
      return mails ?? [];
    } catch (error) {
      console.error('Error fetching inbox mails:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Mail | undefined> {
    try {
      const mail = await this.http.get<Mail>(`${this.mailUrl}/${id}`).toPromise();
      return mail;
    } catch (error) {
      console.error('Error fetching mail by ID:', error);
      return undefined;
    }
  }

  async updateMailStatus(id: number, status: { isChecked: boolean, checkedBy?: string }): Promise<void> {
    try {
      await this.http.put<void>(`${this.mailUrl}/${id}`, status).toPromise();
    } catch (error) {
      console.error('Error updating mail status:', error);
    }
  }

  async updateCheckObject(mailId: number, user: string): Promise<void> {
    try {
      const mail = await this.getById(mailId);
      if (mail) {
        const check = await this.checkService.getCheckByDate(mail.receivedDateTime, mail.department);
        if (check) {

          const currentDate = new Date();
          const day = currentDate.getDate().toString().padStart(2, "0");
          const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
          const year = currentDate.getFullYear();
          const hours = currentDate.getHours().toString().padStart(2, "0");
          const minutes = currentDate.getMinutes().toString().padStart(2, "0");
          const seconds = currentDate.getSeconds().toString().padStart(2, "0");

          const date = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

          const updatedCheck: Check = {
            ...check,
            isChecked: false,
            keyWords: check.keyWords.map((keyword: Keyword) => {
              if (keyword.name === mail.subject) {
                return {
                  ...keyword,
                  checkedBy: {
                    person: { name: user },
                    date: date,
                    department: mail.department
                  }
                };
              }
              return keyword;
            }),
          };

          // Prüfen, ob alle Keywords gechecked sind
          const allKeywordsChecked = updatedCheck.keyWords.every(keyword => keyword.checkedBy?.person != null && keyword.checkedBy?.date != null);

          // Wenn alle Keywords gechecked sind, das Check-Objekt auch als gechecked markieren
          if (allKeywordsChecked) {
            updatedCheck.isChecked = true;
          }

          await this.checkService.updateCheck(updatedCheck);
        }
      }
    } catch (error) {
      console.error('Error updating check object:', error);
    }
  }
}
