import { Chat } from './../../models/chat.model';
import { ChatService } from './../../providers/chat.service';
import { ChatPage } from './../chat/chat';
import { AuthService } from './../../providers/auth.service';
import { UserService } from './../../providers/user.service';
import { User } from './../../models/user.model';
import { SignupPage } from './../signup/signup';
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { FirebaseListObservable } from "angularfire2";
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: FirebaseListObservable<User[]>;
  chats: FirebaseListObservable<Chat[]>;
  view: string = "chats";

  constructor(public navCtrl: NavController,
    public userService: UserService,
    public authService: AuthService,
    public chatService: ChatService,
    public menuCtrl: MenuController) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.chats = this.chatService.chats;
    this.users = this.userService.users;
    this.menuCtrl.enable(true, "user-menu");
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  onChatCreate(recipientUser: User) {
    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {
        this.chatService.getDeepChat(currentUser.$key, recipientUser.$key)
          .first()
          .subscribe((chat: Chat) => {

            if (chat.hasOwnProperty("$value")) {
              let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

              let chat1 = new Chat("", timestamp, recipientUser.name, (recipientUser.photo || ""));
              this.chatService.create(chat1, currentUser.$key, recipientUser.$key);

              let chat2 = new Chat("", timestamp, currentUser.name, (currentUser.photo || ""));
              this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
            }

          });
      });

    this.navCtrl.push(ChatPage, {
      recipientUser: recipientUser
    });
  }

  onChatOpen(chat: Chat): void {
    let recipientUser: string = chat.$key;

    this.userService.get(recipientUser).first().subscribe((user: User) => {
      this.navCtrl.push(ChatPage, {
        recipientUser: user
      });
    });
  }

  filterItens(event: any): void {
    let searchTerm: string = event.target.value;

    this.chats = this.chatService.chats;
    this.users = this.userService.users;

    if (searchTerm) {
      switch (this.view) {
        case 'chats':
          this.chats = <FirebaseListObservable<Chat[]>>this.chats
            .map((chats: Chat[]) => {
              return chats.filter((chat: Chat) => {
                return chat.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
              });
            });
          break;

          case 'users':
          this.users = <FirebaseListObservable<User[]>>this.users
            .map((users: User[]) => {
              return users.filter((user: User) => {
                return user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
              });
            });
          break;
      }
    }

  }

}
