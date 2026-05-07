import { Injectable, signal } from '@angular/core';

export interface FlashMessage {
  text: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _flash = signal<FlashMessage | null>(null);

  set(msg: FlashMessage): void {
    this._flash.set(msg);
  }

  consume(): FlashMessage | null {
    const msg = this._flash();
    this._flash.set(null);
    return msg;
  }
}
