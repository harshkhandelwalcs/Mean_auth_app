import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    username: String;
    password: String;
    private finished: boolean = false;
    constructor(private authService: AuthService,
        private router: Router,
        private flashMessage: FlashMessagesService,
        private validateService: ValidateService) { }

    ngOnInit() {
    }

    onLoginSubmit() {

        const user = {
            username: this.username,
            password: this.password
        }

        if (!this.validateService.validateLogin(user.username, user.password)) {
            this.finished = true;
            this.flashMessage.show("Please fill all fields", { cssClass: "alert-danger", timeout: 3000 });
            setTimeout(() => {
                this.finished = false;
            }, 3000);
            return false;
        }

        this.authService.authenticateUser(user).subscribe((data) => {
            if (data.success) {
                this.authService.storeUserData(data.token, data.user);
                this.flashMessage.show("You are now logged in", { cssClass: 'alert-success', timeout: 1000 });
                this.router.navigate(['/dashboard']);
            } else {
                this.finished = true;
                this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
                this.router.navigate(['/login']);
                setTimeout(() => {
                    this.finished = false;
                }, 3000);
            }
        })


    }

}
