import { Routes } from '@angular/router';
import { OverviewComponent } from './features/dashboard/overview.component';
import { AnalyticsComponent } from './features/dashboard/analytics.component';
import { Login } from './features/auth/login/login';
import { Pos } from './features/pos/pos';
import { MobileAudit } from './features/mobile-audit/mobile-audit';
import { ShiftReconciliationComponent } from './features/reports/shift-reconciliation.component';
import { SettingsComponent } from './features/settings/settings';
import { CashierComponent } from './features/cashier/cashier.component';

import { permissionGuard } from './core/guards/permission.guard';
import { Modulo } from './core/models/permissions.model';

// Admin imports
import { AdminLayoutComponent } from './features/admin/layout/admin-layout/admin-layout';
import { ProductsComponent } from './features/admin/products/products';
import { CategoriesComponent } from './features/admin/categories/categories';
import { CustomersComponent } from './features/admin/customers/customers';
import { InventoryComponent } from './features/admin/inventory/inventory';
import { BranchesComponent } from './features/admin/branches/branches';

export const routes: Routes = [
  { path: 'login', component: Login },
  { 
    path: 'pos', 
    component: Pos,
    canActivate: [permissionGuard],
    data: { permission: Modulo.VENTAS }
  },
  { path: 'settings', component: SettingsComponent },
  { path: 'auditoria', component: MobileAudit },
  { 
    path: 'cashier', 
    component: CashierComponent,
    canActivate: [permissionGuard],
    data: { permission: Modulo.CAJA }
  },
  { 
    path: 'overview', 
    component: OverviewComponent,
    canActivate: [permissionGuard],
    data: { permission: Modulo.DASHBOARD }
  },
  { 
    path: 'analytics', 
    component: AnalyticsComponent,
    canActivate: [permissionGuard],
    data: { permission: Modulo.GERENCIA }
  },
  { 
    path: 'shift-reconciliation', 
    component: ShiftReconciliationComponent,
    canActivate: [permissionGuard],
    data: { permission: Modulo.GERENCIA }
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [permissionGuard],
    data: { permission: Modulo.ADMINISTRACION },
    children: [
      { path: 'products', component: ProductsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'branches', component: BranchesComponent },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
