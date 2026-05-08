import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './patient-form.html',
  styleUrls: ['./patient-form.scss'],
})
export class PatientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);

  form!: FormGroup;
  isLoading = signal(false);
  isLoadingData = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);
  editId = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!id);
    this.editId.set(id);

    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      phone: [''],
      has_whatsapp: [false],
      document: [''],
      birth_date: [''],
      emergency_contact_name: [''],
      emergency_contact_phone: [''],
    });

    if (id) {
      this.isLoadingData.set(true);
      this.patientService.getById(id).subscribe({
        next: (res) => {
          const p = res.data;
          if (p) {
            this.form.patchValue({
              full_name: p.full_name,
              phone: p.phone,
              has_whatsapp: p.has_whatsapp,
              document: p.document,
              birth_date: p.birth_date ? p.birth_date.substring(0, 10) : '',
              emergency_contact_name: p.emergency_contact_name,
              emergency_contact_phone: p.emergency_contact_phone,
            });
          }
          this.isLoadingData.set(false);
        },
        error: () => {
          this.errorMessage.set('Erro ao carregar dados do paciente.');
          this.isLoadingData.set(false);
        },
      });
    }
  }

  get fullName() { return this.form.get('full_name'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const value = { ...this.form.value };
    if (!value.birth_date) {
      delete value.birth_date;
    } else {
      value.birth_date = `${value.birth_date}T00:00:00Z`;
    }

    const id = this.editId();
    if (id) {
      this.patientService.update(id, value).subscribe({
        next: () => this.router.navigate(['/patients']),
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Erro ao atualizar paciente.');
          this.isLoading.set(false);
        },
      });
    } else {
      this.patientService.create(value).subscribe({
        next: () => this.router.navigate(['/patients']),
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Erro ao criar paciente.');
          this.isLoading.set(false);
        },
      });
    }
  }
}
