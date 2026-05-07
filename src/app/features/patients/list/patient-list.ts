import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { Profile } from '../../../core/models/profile.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patient-list.html',
  styleUrls: ['./patient-list.scss'],
})
export class PatientListComponent implements OnInit {
  private patientService = inject(PatientService);
  private router = inject(Router);

  allPatients = signal<Profile[]>([]);
  searchQuery = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  patients = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allPatients();
    return this.allPatients().filter(p =>
      p.full_name.toLowerCase().includes(q) ||
      (p.document ?? '').includes(q)
    );
  });

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading.set(true);
    this.patientService.list().subscribe({
      next: (res) => {
        this.allPatients.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao carregar pacientes.');
        this.isLoading.set(false);
      },
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  editPatient(id: string): void {
    this.router.navigate(['/patients', id, 'edit']);
  }

  deletePatient(id: string, name: string): void {
    if (!confirm(`Remover o paciente "${name}"? Esta ação não pode ser desfeita.`)) return;

    this.patientService.delete(id).subscribe({
      next: () => {
        this.allPatients.update(list => list.filter(p => p.id !== id));
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao remover paciente.');
      },
    });
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
