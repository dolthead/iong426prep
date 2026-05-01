import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/angular/standalone';
import { Badge } from '@awesome-cordova-plugins/badge/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule, IonButton, FormsModule, IonInput, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Tab3Page implements OnInit {
  badgeCount: number = 3;
  messageText: string = 'Testing';
  badge = new Badge();

  constructor() {}

  ngOnInit() {
    this.setBadgeCount();
  }

  setBadgeCount() {
    // update the browser notification badge count
    if (window && 'navigator' in window && 'setAppBadge' in navigator) {
      navigator.setAppBadge(this.badgeCount).catch((error) => {
        console.error('Failed to set badge count:', error);
      });
    }
    this.badge.set(this.badgeCount);
    this.sendEvent();
  }

  clearBadgeCount() {
    this.badgeCount = 0;
    // clear the browser notification badge
    if (window && 'navigator' in window && 'clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch((error) => {
        console.error('Failed to clear badge count:', error);
      });
    }
    this.badge.clear();
    this.sendEvent();
  }

  sendEvent() {
    // create badgeCount event and dispatch it to the window
    const badgeCountEvent = new CustomEvent('badgeCount', { detail: { count: this.badgeCount } });
    window.dispatchEvent(badgeCountEvent);
  }

  sendMessage() {
    // send notification
    if (window && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('New Message', { body: this.messageText });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('New Message', { body: this.messageText });
          }
        });
      }
    }
  }
}
