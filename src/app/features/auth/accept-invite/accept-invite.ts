import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InviteService } from '../../../core/services/invite.service';
import { NotificationService } from '../../../core/services/notification.service';

function passwordMatchValidator(form: AbstractControl) {
  const pw = form.get('password')?.value;
  const confirm = form.get('confirmPassword')?.value;
  return pw === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-accept-invite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './accept-invite.html',
  styleUrls: ['./accept-invite.scss'],
})
export class AcceptInviteComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  tokenMissing = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inviteService = inject(InviteService);
  private notification = inject(NotificationService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.tokenMissing = !token;

    this.form = this.fb.group(
      {
        token: [token],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { token, password } = this.form.value;

    this.inviteService.accept({ token, password }).subscribe({
      next: (res) => {
        this.notification.set({ text: res.message || 'Conta criada com sucesso!', type: 'success' });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.notification.set({ text: err?.error?.message ?? 'Token inválido ou expirado.', type: 'error' });
        this.router.navigate(['/login']);
      },
    });
  }
}
