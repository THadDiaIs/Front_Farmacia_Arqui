import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InventarioService } from '../../../core/services/inventario';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, CheckboxModule],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css']
})
export class InventoryComponent implements OnInit {
  items: any[] = [];
  displayDialog: boolean = false;
  form: FormGroup;
  isEdit: boolean = false;
  selectedId: number | null = null;

  constructor(private service: InventarioService, private fb: FormBuilder) {
    this.form = this.fb.group({
      sucursalId: [null, Validators.required],
      productoId: [null, Validators.required],
      lote: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      cantidadDisponible: [null, [Validators.required, Validators.min(0)]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.findAll().subscribe((res: any) => {
      this.items = res.data || [];
    });
  }

  showDialogToAdd() {
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset({ activo: true });
    this.displayDialog = true;
  }

  showDialogToEdit(item: any) {
    this.isEdit = true;
    this.selectedId = item.id;
    
    // Format date if needed
    const formData = { ...item };
    if (formData.fechaVencimiento) {
      formData.fechaVencimiento = formData.fechaVencimiento.split('T')[0];
    }
    this.form.patchValue(formData);
    this.displayDialog = true;
  }

  save() {
    if (this.form.invalid) return;
    
    if (this.isEdit && this.selectedId) {
      this.service.update(this.selectedId, this.form.value).subscribe((res: any) => {
        this.loadData();
        this.displayDialog = false;
      });
    } else {
      this.service.create(this.form.value).subscribe((res: any) => {
        this.loadData();
        this.displayDialog = false;
      });
    }
  }

  delete(item: any) {
    if(confirm('Are you sure you want to delete this item?')) {
      this.service.delete(item.id).subscribe((res: any) => this.loadData());
    }
  }
}
