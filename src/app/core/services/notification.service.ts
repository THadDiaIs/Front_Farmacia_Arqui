import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageService = inject(MessageService);

  showSuccess(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'success',
      summary: summary || 'Éxito',
      detail: detail || ''
    });
  }

  showError(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary || 'Error',
      detail: detail || 'Ocurrió un error inesperado'
    });
  }

  showInfo(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'info',
      summary: summary || 'Información',
      detail: detail || ''
    });
  }

  showWarn(summary: string, detail?: string) {
    this.messageService.add({
      severity: 'warn',
      summary: summary || 'Advertencia',
      detail: detail || ''
    });
  }
}
