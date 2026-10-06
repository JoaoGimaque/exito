import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CustomerService } from '../../services/customer.service'
import { NzMessageService } from 'ng-zorro-antd/message'


@Component({
  selector: 'app-book-car',
  templateUrl: './book-car.component.html',
  styleUrl: './book-car.component.scss'
})
export class BookCarComponent {
  constructor(
    private service: CustomerService,
    private activeRoute: ActivatedRoute,
    private message: NzMessageService
  ) {}

  carId: number = this.activeRoute.snapshot.params['id']
  car: any
  galleryImages: string[] = []
  activeImageIndex = 0
  readonly whatsappNumber = '5595984105024'

  ngOnInit() {
    this.getCarById()
  }

  get whatsappUrl(): string {
    const carName = [this.car?.brand, this.car?.name].filter(Boolean).join(' ')
    const message = `oi, vi no site o ${carName}, tenho interese e gostaria de mais informações`
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  formatPrice(price: number): string {
    return Number(price || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  selectImage(index: number): void {
    this.activeImageIndex = index
  }

  nextImage(): void {
    if (this.galleryImages.length > 1) {
      this.activeImageIndex = (this.activeImageIndex + 1) % this.galleryImages.length
    }
  }

  previousImage(): void {
    if (this.galleryImages.length > 1) {
      this.activeImageIndex = (this.activeImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length
    }
  }

  private getCarById() {
    this.service.getCarById(this.carId).subscribe({
      next: res => {
        this.car = res
        this.galleryImages = this.buildGallery(res)
        this.activeImageIndex = 0
      },
      error: () => this.message.error('Não foi possível carregar este veículo')
    })
  }

  private buildGallery(car: any): string[] {
    const rawImages = car.returnedImages || car.images || car.fotos || car.galeria || car.gallery || []
    const images = Array.isArray(rawImages) ? rawImages : [rawImages]
    const gallery = images
      .map(image => this.toImageSource(image))
      .filter((image): image is string => Boolean(image))

    const mainImage = this.toImageSource(car.returnedImage || car.imagem_principal || car.processedImage)
    if (mainImage && !gallery.includes(mainImage)) {
      gallery.unshift(mainImage)
    }

    return gallery.length ? gallery : ['']
  }

  private toImageSource(image: any): string {
    if (!image) return ''
    if (typeof image === 'object') {
      image = image.returnedImage || image.base64 || image.url || image.src
    }
    if (!image || typeof image !== 'string') return ''
    if (image.startsWith('data:') || image.startsWith('http')) return image
    return `data:image/jpeg;base64,${image}`
  }
}
