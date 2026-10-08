import { Component } from '@angular/core'
import { AdminService } from '../../services/admin.service'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  cars: any[] = [];

  constructor(
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllCars();
  }

  getActiveCarsCount(): number {
    return this.cars.filter(car => car.status === 'active' || !car.status).length;
  }

  getAllCars(): void {
    this.adminService.getAllCars().subscribe({
      next: (res: any[]) => {
        this.cars = res.map((car: any) => ({
          ...car,
          processedImage: car.returnedImage
            ? `data:image/jpeg;base64,${car.returnedImage}`
            : '',
        }));

      },
      error: () => {
        this.message.error('Erro ao carregar os veículos');
      }
    });
  }

  formatPrice(price: number): string {
    return Number(price || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  deleteCar(id: number): void {
    this.adminService.deleteCar(id).subscribe({
      next: () => {
        this.cars = this.cars.filter(car => car.id !== id);
        this.message.success(
          'Car deleted successfully',
          { nzDuration: 3000 }
        );
      },
      error: () => {
        this.message.error('Erro ao deletar o veículo');
      }
    });
  }
}
