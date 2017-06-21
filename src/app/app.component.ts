import { FirebaseAuthState } from 'angularfire2';
import { UserService } from './../providers/user.service';
import { AuthService } from './../providers/auth.service';
import { User } from './../models/user.model';
import { SigninPage } from './../pages/signin/signin';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from "../pages/home/home";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  currentUser: User;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    authService: AuthService,
    userService: UserService) {
    authService.auth.subscribe((authState: FirebaseAuthState) => {
      if (authState) {
        userService.currentUser.subscribe((user: User) => {
          //Teste
          this.currentUser = user;
          this.rootPage = HomePage;
        })
      } else {
        this.rootPage = SigninPage;
      }

    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

