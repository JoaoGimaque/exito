package com.shounoop.exitospring.services.admin;

import com.shounoop.exitospring.dto.CarDto;
import com.shounoop.exitospring.dto.CarDtoListDto;
import com.shounoop.exitospring.dto.SearchCarDto;

import java.io.IOException;
import java.util.List;

public interface AdminService {
    boolean postCar(CarDto carDto) throws IOException;

    List<CarDto> getAllCars();

    void deleteCar(Long id);

    CarDto getCarById(Long id);

    boolean updateCar(Long id, CarDto carDto) throws IOException;

    CarDtoListDto searchCar(SearchCarDto searchCarDto);
}
