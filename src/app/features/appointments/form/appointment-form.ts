import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ClinicService } from '../../../core/services/clinic.service';
import { Clinic } from '../../../core/models/clinic.model';

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

  form!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  clinics = signal<Clinic[]>([]);

  ngOnInit(): void {
    this.form = this.fb.group({
      clinic_id: ['', Validators.required],
      patient_id: ['', Validators.required],
      dentist_id: ['', Validators.required],
      scheduled_at: ['', Validators.required],
      secretary_id: [''],
      notes: [''],
    });

    this.clinicService.list().subscribe({
      next: (res) => this.clinics.set(res.data ?? []),
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
    const payload = {
      ...value,
      scheduled_at: new Date(value.scheduled_at).toISOString(),
    };

    this.appointmentService.create(payload).subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao criar agendamento.');
        this.isLoading.set(false);
      },
    });
  }
}
