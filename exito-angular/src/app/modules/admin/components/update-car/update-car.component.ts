import { Component } from '@angular/core'
import { AdminService } from '../../services/admin.service'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrl: './update-car.component.scss'
})
export class UpdateCarComponent {
  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {}

  isSpinning: boolean = false
  carId: number = this.activatedRoute.snapshot.params['id']
  imgChanged: boolean = false
  selectedFiles: File[] = []
  imagePreview: string | ArrayBuffer | null = null
  existingImages: string[] = []
  updateForm!: FormGroup // ! is used to tell TypeScript that this variable will be initialized later
  listOfOption: Array<{ label: string; value: string }> = []
  listOfBrands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Lexus']
  listOfType = ['Sports Car', 'Diesel', 'Crossover', 'Luxury Car']
  listOfColor = ['Red', 'Blue', 'Brown', 'Green']
  listOfTransmission = ['Manual', 'Automatic']

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      ownerName: [null],
      brand: [null, Validators.required],
      type: [null, Validators.required],
      color: [null, Validators.required],
      transmission: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required],
      year: [null, Validators.required]
    })

    this.getCarById()
  }

  getCarById() {
    this.isSpinning = true

    this.adminService.getCarById(this.carId).subscribe(res => {
      this.isSpinning = false

      const carDto = res
      this.existingImages = (carDto.returnedImages || [carDto.returnedImage])
        .filter(Boolean)
        .map((image: string) => `data:image/jpeg;base64,${image}`)
      this.updateForm.patchValue(carDto)
    })
  }

  updateCar() {
    if (this.updateForm.invalid || this.isSpinning) {
      this.updateForm.markAllAsTouched()
      return
    }

    this.isSpinning = true

    const formData: FormData = new FormData()
    if (this.imgChanged) {
      this.selectedFiles.forEach(file => formData.append('images', file))
    }

    formData.append('brand', this.updateForm.value.brand)
    formData.append('name', this.updateForm.value.name)
    formData.append('ownerName', this.updateForm.value.ownerName || '')
    formData.append('type', this.updateForm.value.type)
    formData.append('color', this.updateForm.value.color)
    formData.append('year', this.updateForm.value.year)
    formData.append('transmission', this.updateForm.value.transmission)
    formData.append('description', this.updateForm.value.description)
    formData.append('price', this.updateForm.value.price)

    this.adminService.updateCar(this.carId, formData).subscribe(
      res => {
        this.message.success('Car updated successfully', { nzDuration: 3000 })
        this.isSpinning = false
        this.router.navigateByUrl('/admin/dashboard')
      },
      error => {
        this.message.error('Error updating car', { nzDuration: 3000 })
        this.isSpinning = false
        console.log(error)
      }
    )
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files || [])
    this.imgChanged = true
    this.existingImages = []
    this.imagePreview = null
  }
}
