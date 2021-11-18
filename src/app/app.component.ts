import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var Pizzicato: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'YoutubeMp3app';
  songUrl: string;
  audio: HTMLAudioElement;
  duration: number;
  sound: any;
  isPlaying: boolean;
  ready: boolean;
  firstTimePlay: any;
  constructor(
    private http:HttpClient
  ){

  }

  ngOnInit(){
    this.getBase64();
  }

  goToServer(){
    console.log("C parti");
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    // You can replace the url params by the Youtube Video ID of your choose
    return this.http.get<any>("https://my-little-app-310.herokuapp.com/toMp3?url=lTRiuFIWV54", {responseType:'json'});
  }

  getBase64(){
    console.log("GO");
    this.goToServer().subscribe(
      res => {
        var title = this.decode_utf8(res.title);
        this.title = title.slice(0, -15);
        this.songUrl = "data:audio/mp3;base64," + res.src;
        if(this.songUrl){
          this.start(this.songUrl);
        }
      }
    );
  }

  start(songUrl:any){
    this.sound = new Pizzicato.Sound(songUrl, () => {
      this.play();
    });
    setTimeout(()=>{
      this.isPlaying = true;
      this.ready = true;
    },1000)
  }
  
  play(){
    if(!this.firstTimePlay){
      this.audio.play();
    } else{
      this.firstTimePlay = false;
    }
    this.sound.play();
    console.log(this.sound);
    this.isPlaying = true;
  }

  pause(){
    this.audio.pause();
    this.isPlaying = false;
  }

  decode_utf8(uri:any){
    return decodeURIComponent( escape( uri ) );
  }

}
