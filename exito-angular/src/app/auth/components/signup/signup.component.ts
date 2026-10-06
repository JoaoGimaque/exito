import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../services/auth/auth.service'
import { NzMessageService } from 'ng-zorro-antd/message'
import { Router } from '@angular/router'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  isSpinning: boolean = false

  // ! means that the property will be initialized later in the code and will not be null or undefined when used in the code
  signupForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]]
    })
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true }
    } else if (control.value !== this.signupForm.controls['password'].value) {
      return { confirm: true, error: true }
    }
    return {}
  }

  register(): void {
    if (this.signupForm.invalid || this.isSpinning) {
      this.signupForm.markAllAsTouched()
      return
    }

    this.isSpinning = true
    this.authService.register(this.signupForm.value).subscribe({
      next: res => {
        this.isSpinning = false
        if (res?.id != null) {
          this.message.success('Cadastro realizado com sucesso', { nzDuration: 5000 })
          this.router.navigateByUrl('/login')
          return
        }

        this.message.error('Não foi possível concluir o cadastro', { nzDuration: 5000 })
      },
      error: () => {
        this.isSpinning = false
        this.message.error('Não foi possível concluir o cadastro', { nzDuration: 5000 })
      }
    })
  }
}
