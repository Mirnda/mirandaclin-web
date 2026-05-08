import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ClinicService } from '../../../core/services/clinic.service';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { Clinic } from '../../../core/models/clinic.model';
import { Profile } from '../../../core/models/profile.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './appointment-form.html',
  styleUrls: ['./appointment-form.scss'],
})
export class AppointmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private appointmentService = inject(AppointmentService);
  private clinicService = inject(ClinicService);
  private patientService = inject(PatientService);
  private authService = inject(AuthService);

  form!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  clinics = signal<Clinic[]>([]);
  patients = signal<Profile[]>([]);
  dentists = signal<Profile[]>([]);

  ngOnInit(): void {
    const secretaryId = this.authService.jwtPayload()?.sub ?? '';

    this.form = this.fb.group({
      clinic_id: ['', Validators.required],
      patient_id: ['', Validators.required],
      dentist_id: ['', Validators.required],
      scheduled_at: ['', Validators.required],
      secretary_id: [secretaryId],
      notes: [''],
    });

    this.clinicService.list().subscribe({
      next: (res) => this.clinics.set(res.data ?? []),
    });

    this.patientService.list().subscribe({
      next: (res) => this.patients.set(res.data ?? []),
    });

    this.patientService.listDentists().subscribe({
      next: (res) => this.dentists.set(res.data ?? []),
    });
  }

  get clinicId() { return this.form.get('clinic_id'); }
  get patientId() { return this.form.get('patient_id'); }
  get dentistId() { return this.form.get('dentist_id'); }
  get scheduledAt() { return this.form.get('scheduled_at'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const value = this.form.value;
    const payload: Record<string, unknown> = {
      clinic_id: value.clinic_id,
      patient_id: value.patient_id,
      dentist_id: value.dentist_id,
      scheduled_at: new Date(value.scheduled_at).toISOString(),
      notes: value.notes,
    };
    if (value.secretary_id) {
      payload['secretary_id'] = value.secretary_id;
    }

    this.appointmentService.create(payload as never).subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao criar agendamento.');
        this.isLoading.set(false);
      },
    });
  }
}
