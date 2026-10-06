import { Component } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AdminService } from '../../services/admin.service'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-search-car',
  templateUrl: './search-car.component.html',
  styleUrl: './search-car.component.scss'
})
export class SearchCarComponent {
  searchCarForm!: FormGroup
  listOfOption: Array<{ label: string; value: string }> = []
  listOfBrands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Lexus']
  listOfType = ['Sports Car', 'Diesel', 'Crossover', 'Luxury Car']
  listOfColor = ['Red', 'Blue', 'Brown', 'Green']
  listOfTransmission = ['Manual', 'Automatic']
  isSpinning = false
  cars: any[] = []

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private message: NzMessageService
  ) {
    this.searchCarForm = this.fb.group({
      brand: [null],
      type: [null],
      transmission: [null],
      color: [null]
    })
  }

  searchCar() {
    this.cars = []
    this.isSpinning = true
    this.service.searchCar(this.searchCarForm.value).subscribe(
      res => {
        this.isSpinning = false

        const carDtoList = res?.carDtoList || []

        carDtoList.forEach((car: any) => {
          car.processedImage = car.returnedImage
            ? `data:image/jpeg;base64,${car.returnedImage}`
            : ''
          this.cars.push(car)
        })

        if (!this.cars.length) {
          this.message.info('Nenhum veículo encontrado')
        }
      },
      () => {
        this.isSpinning = false
        this.message.error('Não foi possível realizar a busca')
      }
    )
  }
}
