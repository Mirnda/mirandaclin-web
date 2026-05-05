import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConsultationService } from '../../../core/services/consultation.service';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './consultation-form.html',
  styleUrls: ['./consultation-form.scss'],
})
export class ConsultationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private consultationService = inject(ConsultationService);

  form!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.form = this.fb.group({
      appointment_id: ['', Validators.required],
      patient_id: ['', Validators.required],
      diagnosis: ['', Validators.required],
      treatment: ['', Validators.required],
    });
  }

  get appointmentId() { return this.form.get('appointment_id'); }
  get patientId() { return this.form.get('patient_id'); }
  get diagnosis() { return this.form.get('diagnosis'); }
  get treatment() { return this.form.get('treatment'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.consultationService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/consultations']),
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao registrar consulta.');
        this.isLoading.set(false);
      },
    });
  }
}
