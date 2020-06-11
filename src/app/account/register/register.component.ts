import { Component, OnInit } from '@angular/core';
import { RegistrationInput } from 'src/app/shared/model/registrationInput.model';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  success: boolean;
  error: string;
  registrationInput: RegistrationInput = { firstName: '',  lastName: '', email: '', password: ''};
  submitted: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.authService.register(this.registrationInput)
      .subscribe(result => {
        if (result) {
          this.success = true;
        }
      },
        error => {
          this.error = error;
        }
      );
  }
}
