import { Component } from '@angular/core'
import { CustomerService } from '../../services/customer.service'

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss'
})
export class CustomerDashboardComponent {
  constructor(private service: CustomerService) {}

  cars: any[] = []
  searchTerm = ''
  selectedBrand = ''
  selectedType = ''
  isSpinning = false
  errorMessage = ''

  get brands(): string[] {
    return [...new Set(this.cars.map(car => car.brand).filter(Boolean))].sort()
  }

  get types(): string[] {
    return [...new Set(this.cars.map(car => car.type).filter(Boolean))].sort()
  }

  get filteredCars(): any[] {
    const search = this.searchTerm.trim().toLocaleLowerCase('pt-BR')
    return this.cars.filter(car => {
      const text = `${car.brand || ''} ${car.name || ''} ${car.year || ''} ${car.type || ''}`.toLocaleLowerCase('pt-BR')
      return (!search || text.includes(search)) &&
        (!this.selectedBrand || car.brand === this.selectedBrand) &&
        (!this.selectedType || car.type === this.selectedType)
    })
  }

  ngOnInit() {
    this.getAllCars()
  }

  getAllCars() {
    this.isSpinning = true
    this.service.getAllCars().subscribe({
      next: res => {
        this.cars = (res || []).map((car: any) => {
          const images = (car.returnedImages || [])
            .map((image: string) => this.toImageSource(image))
            .filter(Boolean)
          const mainImage = this.toImageSource(car.returnedImage)
          if (mainImage && !images.includes(mainImage)) images.unshift(mainImage)
          return { ...car, galleryImages: images, processedImage: images[0] || '' }
        })
        this.isSpinning = false
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os veículos.'
        this.isSpinning = false
      }
    })
  }

  formatPrice(price: number): string {
    return Number(price || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  private toImageSource(image: any): string {
    if (!image) return ''
    if (typeof image !== 'string') return ''
    return image.startsWith('data:') || image.startsWith('http')
      ? image
      : `data:image/jpeg;base64,${image}`
  }
}
