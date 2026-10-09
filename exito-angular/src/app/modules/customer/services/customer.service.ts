import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

const BASIC_URL = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getAllCars(): Observable<any> {
    return this.http.get(`${BASIC_URL}/api/customer/cars`)
  }

  getCarById(id: number): Observable<any> {
    return this.http.get(`${BASIC_URL}/api/customer/car/${id}`)
  }

}
