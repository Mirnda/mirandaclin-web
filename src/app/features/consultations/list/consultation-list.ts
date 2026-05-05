import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConsultationService } from '../../../core/services/consultation.service';
import { Consultation } from '../../../core/models/consultation.model';

@Component({
  selector: 'app-consultation-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './consultation-list.html',
  styleUrls: ['./consultation-list.scss'],
})
export class ConsultationListComponent {
  private consultationService = inject(ConsultationService);
  private fb = inject(FormBuilder);

  consultations = signal<Consultation[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  searched = signal(false);

  searchForm = this.fb.group({
    filter_type: ['patient'],
    filter_id: [''],
  });

  search(): void {
    const type = this.searchForm.get('filter_type')?.value;
    const id = this.searchForm.get('filter_id')?.value?.trim();
    if (!id) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.searched.set(true);

    const obs = type === 'dentist'
      ? this.consultationService.listByDentist(id)
      : this.consultationService.listByPatient(id);

    obs.subscribe({
      next: (res) => {
        this.consultations.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'Erro ao buscar consultas.');
        this.isLoading.set(false);
      },
    });
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }
}
