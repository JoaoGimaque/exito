package com.shounoop.exitospring.services.customer;

import com.shounoop.exitospring.dto.CarDto;

import java.util.List;

public interface CustomerService {
    List<CarDto> getAllCars();

    CarDto getCarById(Long id);
}
