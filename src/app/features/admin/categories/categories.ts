import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule, SortIcon } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CategoriaService } from '../../../core/services/categoria';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, CheckboxModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit {
  items: any[] = [];
  displayDialog: boolean = false;
  form: FormGroup;
  isEdit: boolean = false;
  selectedId: number | null = null;

  constructor(private service: CategoriaService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.findAll().subscribe(res => this.items = res.data);
  }

  showDialogToAdd() {
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset();
    this.displayDialog = true;
  }

  showDialogToEdit(item: any) {
    this.isEdit = true;
    this.selectedId = item.id;
    this.form.patchValue(item);
    this.displayDialog = true;
  }

  save() {
    if (this.form.invalid) return;
    
    if (this.isEdit && this.selectedId) {
      this.service.update(this.selectedId, this.form.value).subscribe(() => {
        this.loadData();
        this.displayDialog = false;
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.loadData();
        this.displayDialog = false;
      });
    }
  }

  delete(item: any) {
    if(confirm('Are you sure you want to delete this item?')) {
      this.service.delete(item.id).subscribe(() => this.loadData());
    }
  }
}
