import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InviteService } from '../../../core/services/invite.service';

@Component({
  selector: 'app-invite-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './invite-form.html',
  styleUrls: ['./invite-form.scss'],
})
export class InviteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inviteService = inject(InviteService);

  form!: FormGroup;
  isLoading = signal(false);
  showPassword = false;
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
    });
  }

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
    this.successMessage.set('');

    this.inviteService.create(this.form.value).subscribe({
      next: () => {
        this.successMessage.set(`Convite enviado com sucesso para ${this.form.value.email}!`);
        this.form.reset();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao enviar convite.');
        this.isLoading.set(false);
      },
    });
  }
}
