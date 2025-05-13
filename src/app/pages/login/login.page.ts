import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/core/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  protected loading: boolean = false;
  protected wrongCredentials: boolean = false;

  protected loginForm: FormGroup = new FormGroup<any>({
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl(null, Validators.required)
  });

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) { }

  public ngOnInit(): void {}

  /**
   *
   */
  public ionViewWillEnter(): void {
    this.loginForm.reset();
  }

  /**
   *
   * @protected
   */
  protected async auth(): Promise<void> {
    if(this.loginForm.valid) {
      this.loading = true;
      const credentials = this.loginForm.getRawValue();
      this.loginForm.disable({ emitEvent: true });

      try {
        await lastValueFrom(this.authService.auth(credentials.email, credentials.password));
        await lastValueFrom(this.authService.loadUser());
        this.router.navigateByUrl('/tabs/tab1').finally();
        this.wrongCredentials = false;
      }
      catch(e) {
        console.log(e);
        this.authService.removeAuthData();
        this.wrongCredentials = true;
        this.showWrongCredentialsToast().finally();
        this.loginForm.reset({
          username: this.loginForm.getRawValue().username
        });
      }

      this.loading = false;
      this.loginForm.enable({ emitEvent: true });
    }
  }
  /**
   *
   * @private
   */
  private async showWrongCredentialsToast(): Promise<void> {
    const wrongCredentialsToast = await this.toastController.create({
      color: 'danger',
      message: 'Username and/or Password are wrong',
      duration: 4000,
      position: 'top'
    });
    await wrongCredentialsToast.present();
  }

}

