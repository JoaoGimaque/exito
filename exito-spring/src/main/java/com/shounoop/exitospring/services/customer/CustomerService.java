package com.shounoop.exitospring.services.customer;

import com.shounoop.exitospring.dto.BookACarDto;
import com.shounoop.exitospring.dto.CarDto;

import java.util.List;

public interface CustomerService {
    List<CarDto> getAllCars();

    boolean bookACar(BookACarDto bookACarDto);

    CarDto getCarById(Long id);

    List<BookACarDto> getBookingsByUserId(Long id);
}
