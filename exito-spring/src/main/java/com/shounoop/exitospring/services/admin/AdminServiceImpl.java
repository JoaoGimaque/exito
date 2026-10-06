package com.shounoop.exitospring.services.admin;

import com.shounoop.exitospring.dto.BookACarDto;
import com.shounoop.exitospring.dto.CarDto;
import com.shounoop.exitospring.dto.CarDtoListDto;
import com.shounoop.exitospring.dto.SearchCarDto;
import com.shounoop.exitospring.entity.BookACar;
import com.shounoop.exitospring.entity.Car;
import com.shounoop.exitospring.enums.BookCarStatus;
import com.shounoop.exitospring.repository.BookACarRepository;
import com.shounoop.exitospring.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final CarRepository carRepository;
    private final BookACarRepository bookACarRepository;

    @Override
    public boolean postCar(CarDto carDto) throws IOException {
        boolean isSuccessful = false;

        try {
            Car car = new Car();
            car.setName(carDto.getName());
            car.setBrand(carDto.getBrand());
            car.setColor(carDto.getColor());
            car.setDescription(carDto.getDescription());
            car.setOwnerName(carDto.getOwnerName());
            car.setPrice(carDto.getPrice());
            car.setTransmission(carDto.getTransmission());
            car.setType(carDto.getType());
            car.setYear(carDto.getYear());
            List<byte[]> images = getImageBytes(carDto);
            if (images.isEmpty()) {
                return false;
            }
            car.setImage(images.get(0));
            car.setImages(images);

            carRepository.save(car);

            isSuccessful = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return isSuccessful;
    }

    @Override
    public List<CarDto> getAllCars() {
        return carRepository.findAll().stream().map(Car::getAdminCarDto).collect(Collectors.toList());
    }

    @Override
    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    @Override
    public CarDto getCarById(Long id) {
        return carRepository.findById(id).map(Car::getAdminCarDto).orElse(null);
    }

    @Override
    public boolean updateCar(Long id, CarDto carDto) throws IOException {
        Optional<Car> optionalCar = carRepository.findById(id);

        if (optionalCar.isPresent()) {
            Car existingCar = optionalCar.get();

            List<byte[]> images = getImageBytes(carDto);
            if (!images.isEmpty()) {
                existingCar.setImage(images.get(0));
                existingCar.setImages(images);
            } else if (carDto.getImage() != null && !carDto.getImage().isEmpty()) {
                byte[] image = carDto.getImage().getBytes();
                existingCar.setImage(image);
                existingCar.setImages(new ArrayList<>(List.of(image)));
            }

            existingCar.setPrice(carDto.getPrice());
            existingCar.setYear(carDto.getYear());
            existingCar.setType(carDto.getType());
            existingCar.setDescription(carDto.getDescription());
            existingCar.setOwnerName(carDto.getOwnerName());
            existingCar.setTransmission(carDto.getTransmission());
            existingCar.setColor(carDto.getColor());
            existingCar.setName(carDto.getName());
            existingCar.setBrand(carDto.getBrand());

            carRepository.save(existingCar);

            return true;
        }

        return false;
    }

    private List<byte[]> getImageBytes(CarDto carDto) throws IOException {
        List<byte[]> images = new ArrayList<>();
        if (carDto.getImages() != null) {
            for (var image : carDto.getImages()) {
                if (image != null && !image.isEmpty()) {
                    images.add(image.getBytes());
                }
            }
        }
        if (images.isEmpty() && carDto.getImage() != null && !carDto.getImage().isEmpty()) {
            images.add(carDto.getImage().getBytes());
        }
        return images;
    }

    @Override
    public List<BookACarDto> getBookings() {
        return bookACarRepository.findAll().stream().map(BookACar::getBookACarDto).collect(Collectors.toList());
    }

    @Override
    public boolean changeBookingStatus(Long id, String status) {
        Optional<BookACar> optionalBookACar = bookACarRepository.findById(id);

        if (optionalBookACar.isPresent()) {
            BookACar bookACar = optionalBookACar.get();

            if (Objects.equals(status, "Approve")) {
                bookACar.setBookCarStatus(BookCarStatus.APPROVED);
            } else {
                bookACar.setBookCarStatus(BookCarStatus.REJECTED);
            }

            bookACarRepository.save(bookACar);

            return true;
        }

        return false;
    }

    @Override
    public CarDtoListDto searchCar(SearchCarDto searchCarDto) {
        Car car = new Car();
        car.setBrand(searchCarDto.getBrand());
        car.setType(searchCarDto.getType());
        car.setTransmission(searchCarDto.getTransmission());
        car.setColor(searchCarDto.getColor());

        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withMatcher("brand", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase()).withMatcher("type", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase()).withMatcher("transmission", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase()).withMatcher("color", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase());

        Example<Car> carExample = Example.of(car, exampleMatcher);

        List<Car> carList = carRepository.findAll(carExample);

        CarDtoListDto carDtoListDto = new CarDtoListDto();
        carDtoListDto.setCarDtoList(carList.stream().map(Car::getAdminCarDto).collect(Collectors.toList()));

        return carDtoListDto;
    }
}
