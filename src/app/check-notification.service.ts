import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckNotificationService {
  private _checkNotification$ = new Subject<string>();
  checkNotification$ = this._checkNotification$.asObservable();

  constructor(private toastr: ToastrService) {}

  notify(message: string): void {
    this.toastr.error(message)
  }
}
