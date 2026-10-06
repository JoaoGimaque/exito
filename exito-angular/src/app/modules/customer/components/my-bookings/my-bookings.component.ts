import { Component } from '@angular/core'
import { CustomerService } from '../../services/customer.service'
import { ActivatedRoute } from '@angular/router'
import { StorageService } from '../../../../auth/components/services/storage/storage.service'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent {
  constructor(
    private service: CustomerService,
    private message: NzMessageService
  ) {}

  bookings: any[] = []
  isSpinning = false

  ngOnInit() {
    this.getBookingsByUserId()
  }

  private getBookingsByUserId() {
    this.isSpinning = true

    this.service.getBookingsByUserId().subscribe(
      data => {
        this.bookings = data
        this.isSpinning = false
      },
      error => {
        this.isSpinning = false
        this.message.error('Não foi possível carregar suas reservas')
      }
    )
  }
}
