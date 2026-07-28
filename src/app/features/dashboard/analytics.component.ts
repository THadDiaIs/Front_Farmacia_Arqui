import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DashboardService, MonthlyBehavior } from './dashboard.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="flex flex-col gap-6 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Analytics</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed view of your pharmacy's financial behavior.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Line Chart: Monthly Behavior -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-md transition-all col-span-1 lg:col-span-2">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Monthly Profit Behavior</h2>
          <p-chart type="line" [data]="lineChartData" [options]="lineChartOptions"></p-chart>
        </div>

        <!-- Bar Chart: Earnings -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-md transition-all">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Earnings (Sales)</h2>
          <p-chart type="bar" [data]="barChartData" [options]="barChartOptions"></p-chart>
        </div>

        <!-- Scatter Chart: Expenses -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-md transition-all">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Expenses (Costs)</h2>
          <p-chart type="scatter" [data]="scatterChartData" [options]="scatterChartOptions"></p-chart>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  monthlyData: MonthlyBehavior[] = [];

  lineChartData: any;
  lineChartOptions: any;

  barChartData: any;
  barChartOptions: any;

  scatterChartData: any;
  scatterChartOptions: any;

  private observer!: MutationObserver;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.initChartOptions();
    this.dashboardService.getMonthlyBehavior().subscribe(data => {
      this.monthlyData = data;
      this.initCharts();
    });

    if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => {
        this.initChartOptions();
        if (this.monthlyData.length > 0) {
          this.initCharts();
        }
      });
      this.observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  initCharts() {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const labels = this.monthlyData.map(d => d.month);
    const profitData = this.monthlyData.map(d => d.profit);
    const salesData = this.monthlyData.map(d => d.sales);
    const costsData = this.monthlyData.map(d => d.costs);

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Profit',
          data: profitData,
          fill: false,
          borderColor: isDark ? '#818cf8' : '#4f46e5', // indigo-400 : indigo-600
          tension: 0.4
        }
      ]
    };

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Sales',
          backgroundColor: isDark ? '#34d399' : '#10b981', // emerald-400 : emerald-500
          data: salesData
        }
      ]
    };

    this.scatterChartData = {
      datasets: [
        {
          label: 'Costs',
          backgroundColor: isDark ? '#fb7185' : '#f43f5e', // rose-400 : rose-500
          data: this.monthlyData.map((d, index) => ({ x: index, y: d.costs }))
        }
      ]
    };
    
    // update scatter chart options x-axis based on data
    this.scatterChartOptions = {
      ...this.scatterChartOptions,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          ticks: {
            color: isDark ? '#94a3b8' : '#64748b',
            callback: (value: any) => {
              return labels[value] || '';
            }
          },
          grid: {
            color: isDark ? '#334155' : '#e2e8f0',
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: isDark ? '#94a3b8' : '#64748b'
          },
          grid: {
            color: isDark ? '#334155' : '#e2e8f0',
            drawBorder: false
          }
        }
      }
    };
  }

  initChartOptions() {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#f8fafc' : '#1e293b'; // slate-50 : slate-800
    const textColorSecondary = isDark ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
    const surfaceBorder = isDark ? '#334155' : '#e2e8f0'; // slate-700 : slate-200

    const commonOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.lineChartOptions = { ...commonOptions };
    this.barChartOptions = { ...commonOptions };
    this.scatterChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
