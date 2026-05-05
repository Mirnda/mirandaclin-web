import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit(): void {
    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      tenant_name: [''],
      phone: [''],
    });
  }

  get fullName() { return this.form.get('full_name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { registered: '1' } });
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erro ao criar conta.';
        this.isLoading = false;
      },
    });
  }
}
