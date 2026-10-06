import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CustomerService } from '../modules/customer/services/customer.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  cars: any[] = []
  isSpinning = false
  readonly whatsappUrl = 'https://wa.me/5595984105024?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20ve%C3%ADculos%20da%20%C3%8Axito%20Multimarcas.'

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCars()
  }

  get featuredCars(): any[] {
    const activeCars = this.cars.filter(car => car.status === 'active' || !car.status)
    const highlightedCars = activeCars.filter(car => car.destaque === true)
    return (highlightedCars.length ? highlightedCars : activeCars).slice(0, 6)
  }

  formatPrice(price: number): string {
    return Number(price || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  openCatalog(): void {
    this.router.navigateByUrl('/estoque')
  }

  private loadCars(): void {
    this.isSpinning = true
    this.customerService.getAllCars().subscribe({
      next: cars => {
        const carList = Array.isArray(cars)
          ? cars
          : cars?.carDtoList || cars?.cars || cars?.content || []

        this.cars = carList.map((car: any) => ({
          ...car,
          processedImage: this.toImageSource(car)
        }))
        this.isSpinning = false
      },
      error: () => {
        this.cars = []
        this.isSpinning = false
      }
    })
  }

  private toImageSource(car: any): string {
    const image = car.processedImage || car.returnedImage || car.image || car.imagem_principal
    if (!image) return ''
    if (image.startsWith('data:') || image.startsWith('http')) return image
    return `data:image/jpeg;base64,${image}`
  }
}
