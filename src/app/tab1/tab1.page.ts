import { Component, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonTextarea, IonRow, IonInput, IonCol, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { stopCircleOutline, volumeHighOutline, shareOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonButtons, IonCol, FormsModule, IonInput, IonRow, IonTextarea, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon],
})
export class Tab1Page implements OnInit {
  recognition!: any;
  recognizedText = 'Everybody wants to rule the world...';
  isListening = signal<boolean>(false);
  pitch: number = .5;
  rate: number = 1;

  constructor() {
    addIcons({ stopCircleOutline, volumeHighOutline, shareOutline });
    const SpeechRecognition = (window as any).SpeechRecognition ||
                              (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return;
    }
    this.recognition = new SpeechRecognition();
  }

  ngOnInit() {
    this.recognition.continuous = false;
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => this.isListening.set(true);
    this.recognition.onend = () => this.isListening.set(false);

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      this.recognizedText = transcript;
      this.speak();
      console.log('Recognized text:', transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  record() {
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
  }

  speak() {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(this.recognizedText);
    utterThis.pitch = Math.max(0.1, Math.min(10, this.pitch));
    utterThis.rate = Math.max(0.1, Math.min(10, this.rate));
    synth.speak(utterThis);
  }

  share() {
    if (navigator.share) {
      navigator.share({
        title: 'MTech PWA Speech Recognition',
        text: "Check out this cool speech recognition app built with Ionic and Angular!",
      }).then(() => {
        console.log('Content shared successfully');
      }).catch((error) => {
        console.error('Error sharing content:', error);
      });
    } else {
      console.warn('Web Share API not supported in this browser.');
    }
  }

}
