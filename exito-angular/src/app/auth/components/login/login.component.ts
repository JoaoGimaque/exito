import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../services/auth/auth.service'
import { StorageService } from '../services/storage/storage.service'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isSpinning: boolean = false
  loginForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  login(): void {
    if (this.loginForm.invalid || this.isSpinning) {
      this.loginForm.markAllAsTouched()
      return
    }

    this.isSpinning = true
    this.authService.login(this.loginForm.value).subscribe({
      next: res => {
        if (res?.userId != null && res?.jwt) {
          StorageService.saveUser({ id: res.userId, role: res.userRole })
          StorageService.saveToken(res.jwt)

          if (StorageService.isAdminLoggedIn()) {
            this.router.navigateByUrl('/admin/dashboard')
            return
          }

          if (StorageService.isCustomerLoggedIn()) {
            this.router.navigateByUrl('/customer/dashboard')
            return
          }
        }

        this.message.error('E-mail ou senha inválidos', { nzDuration: 3000 })
        this.isSpinning = false
      },
      error: () => {
        this.isSpinning = false
        this.message.error('Não foi possível entrar agora', { nzDuration: 3000 })
      }
    })
  }
}
