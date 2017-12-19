
import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { URLSearchParams } from "@angular/http";

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
    name: String;
    username: String;
    email: String;
    password: String;
    token: any;
    secret: any = "6Le8NTQUAAAAAOSu-UeAnx4a2uCNzY485662NpOY";
    private finished: boolean = false;
    constructor(private validateService: ValidateService,
        private authService: AuthService,
        private router: Router,
        private flashMessage: FlashMessagesService) { }

    ngOnInit() {
    }

    handleCorrectCaptcha(response) {
        this.token = this.captcha.getResponse();
        let secret = this.secret;
        this.reCaptcha(this.token, secret);
    }
    reCaptcha(token, secret) {
        let data = new URLSearchParams();
        data.set('response', token);
        data.set('secret', secret);
        this.authService.getCaptchaToken(data).subscribe((data) => {
            console.log(data)
        })
    }

    onRegisterSubmit() {
        const user = {
            name: this.name,
            email: this.email,
            username: this.username,
            password: this.password
        }

        if (!this.validateService.validateRegister(user)) {
            this.finished = true;
            this.flashMessage.show("Please fill all fields", { cssClass: "alert-danger", timeout: 3000 });
            setTimeout(() => {
                this.finished = false;
            }, 3000);
            return false;
        }

        //validate email  
        if (!this.validateService.validateEmail(user.email)) {
            this.flashMessage.show("Please use a validate email", { cssClass: "alert-danger", timeout: 3000 });
            return false;
        }

        //register User
        if (this.validateService.validateCaptcha(this.token, this.secret)) {
            this.authService.registerUser(user).subscribe((data) => {
                if (data.success) {
                    this.router.navigate(['/login']);
                    this.flashMessage.show("You are now registered and can login", { cssClass: "alert-success", timeout: 3000 });
                } else {
                    this.flashMessage.show("Something went wrong", { cssClass: "alert-danger", timeout: 3000 });
                    this.router.navigate(['/register']);
                }
            })
        } else {
            this.flashMessage.show("Please complete the Captcha!", { cssClass: "alert-danger", timeout: 3000 });
        }



    }

}

