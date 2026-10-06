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
  featuredCars: any[] = [];
  bookings: any[] = [];
  isSpinning = false;

  constructor(
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllCars();
    this.getBookings();
  }

  getActiveCarsCount(): number {
    return this.cars.filter(car => car.status === 'active' || !car.status).length;
  }

  getPendingBookingsCount(): number {
    return this.bookings.filter(booking => booking.bookCarStatus === 'PENDING').length;
  }

  private getBookings(): void {
    this.isSpinning = true;
    this.adminService.getCarBookings().subscribe({
      next: bookings => {
        this.bookings = bookings;
        this.isSpinning = false;
      },
      error: () => {
        this.isSpinning = false;
        this.message.error('Erro ao carregar as reservas');
      }
    });
  }

  changeBookingStatus(bookingId: number, status: string): void {
    this.adminService.changeBookingStatus(bookingId, status).subscribe({
      next: () => {
        this.message.success('Status da reserva atualizado');
        this.getBookings();
      },
      error: () => this.message.error('Erro ao atualizar a reserva')
    });
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

        this.prepareCars();
      },
      error: () => {
        this.message.error('Erro ao carregar os veículos');
      }
    });
  }

  private prepareCars(): void {
    // Somente veículos ativos
    const activeCars = this.cars.filter(
      car => car.status === 'active' || !car.status
    );

    // Veículos em destaque
    const highlightedCars = activeCars.filter(
      car => car.destaque === true
    );

    // Se tiver destaque, usa eles.
    // Caso contrário, usa os veículos ativos.
    this.featuredCars = highlightedCars.length
      ? highlightedCars.slice(0, 8)
      : activeCars.slice(0, 8);
  }

  formatPrice(price: number): string {
    return Number(price || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatKm(km: number): string {
    return `${Number(km || 0).toLocaleString('pt-BR')} km`;
  }

  getTransmission(car: any): string {
    return (car.transmission || car.cambio || '')
      .toUpperCase() === 'AUTOMÁTICO'
      ? 'Auto'
      : 'Manual';
  }

  deleteCar(id: number): void {
    this.adminService.deleteCar(id).subscribe({
      next: () => {
        this.cars = this.cars.filter(car => car.id !== id);
        this.featuredCars = this.featuredCars.filter(car => car.id !== id);

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
