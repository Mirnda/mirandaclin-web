import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InviteService } from '../../../core/services/invite.service';
import { PatientService } from '../../../core/services/patient.service';
import { Profile } from '../../../core/models/profile.model';

@Component({
  selector: 'app-invite-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './invite-form.html',
  styleUrls: ['./invite-form.scss'],
})
export class InviteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private inviteService = inject(InviteService);
  private patientService = inject(PatientService);

  form!: FormGroup;
  profiles = signal<Profile[]>([]);
  isLoadingProfiles = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      profile_id: ['', Validators.required],
    });

    this.patientService.list().subscribe({
      next: (res) => {
        this.profiles.set(res.data ?? []);
        this.isLoadingProfiles.set(false);
      },
      error: () => {
        this.isLoadingProfiles.set(false);
      },
    });
  }

  get email() { return this.form.get('email'); }
  get profileId() { return this.form.get('profile_id'); }

  roleLabel(role: string): string {
    const labels: Record<string, string> = {
      admin: 'Admin',
      dentist: 'Dentista',
      secretary: 'Secretária',
      patient: 'Paciente',
    };
    return labels[role] ?? role;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.inviteService.create(this.form.value).subscribe({
      next: (res: any) => {
        this.successMessage.set(res.message || `Convite enviado com sucesso para ${this.form.value.email}!`);
        this.isLoading.set(false);
        setTimeout(() => this.router.navigate(['/users']), 2000);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao enviar convite.');
        this.isLoading.set(false);
      },
    });
  }
}
