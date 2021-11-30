import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
declare var Pizzicato: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "YoutubeMp3app";
  songUrl: string;
  audio: HTMLAudioElement;
  duration: number;
  sound: any;
  isPlaying: boolean;
  ready: boolean;
  firstTimePlay: any;
  browser_key: string;
  interval: any;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.browser_key = localStorage.getItem('browser_key')
    if (!this.browser_key){
      this.browser_key = this.makeid(6)
      localStorage.setItem('browser_key', this.browser_key)
    }
    this.getBase64();
  }

  goToServerForMp3() {
    console.log("C parti");
    let headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*");
    // You can replace the url params by the Youtube Video ID of your choose
    return this.http.get<any>(
      "https://my-little-app-310.herokuapp.com/toMp3?url=FP_3nwZPqP0&browser_key=" +
        this.browser_key,
      { responseType: "json" }
    );
  }

  goToServerForDownload() {
    console.log("C parti");
    let headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*");
    // You can replace the url params by the Youtube Video ID of your choose
    return this.http.get<any>(
      "https://my-little-app-310.herokuapp.com/downloadAudio?browser_key=" +
        this.browser_key,
      { responseType: "json" }
    );
  }

  getBase64() {
    console.log("GO");
    this.goToServerForMp3().subscribe((res) => {
      this.interval = setInterval(() => {
        this.checkForDownload();
      }, 5000);
    });
  }

  checkForDownload() {
    this.goToServerForDownload().subscribe((res) => {
      console.log(res);
      if (res.src) {
        clearInterval(this.interval);
        var title = this.decode_utf8(res.title);
        this.title = title.slice(0, -15);
        this.songUrl = res.src;
        if (this.songUrl) {
          this.start(this.songUrl);
        }
      }
    });
  }

  start(songUrl: any) {
    this.sound = new Pizzicato.Sound(songUrl, () => {
      // setTimeout(() => {
        // this.sound.play();  
      // }, 5000);
      
    });
    // setTimeout(() => {
    //   this.isPlaying = true;
    //   this.ready = true;
    // }, 1000);
  }

  play() {
    // if (!this.firstTimePlay) {
    //   this.sound.play();
    // } else {
    //   this.firstTimePlay = false;
    // }
    console.log(this.sound);
    
    this.sound.play();
    // console.log(this.sound);
    this.isPlaying = true;
  }

  pause() {
    this.sound.pause();
    this.isPlaying = false;
  }

  decode_utf8(uri: any) {
    return decodeURIComponent(escape(uri));
  }

  makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
