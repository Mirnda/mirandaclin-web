import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss'],
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);

  form!: FormGroup;
  isLoading = signal(false);
  showPassword = false;
  errorMessage = signal('');

  ngOnInit(): void {
    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
      phone: [''],
      document: [''],
      has_whatsapp: [false],
      emergency_contact_name: [''],
      emergency_contact_phone: [''],
    });
  }

  get fullName() { return this.form.get('full_name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get role() { return this.form.get('role'); }

  togglePassword(): void { this.showPassword = !this.showPassword; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao criar usuário.');
        this.isLoading.set(false);
      },
    });
  }
}
