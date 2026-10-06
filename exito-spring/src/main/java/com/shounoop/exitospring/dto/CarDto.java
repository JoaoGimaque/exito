package com.shounoop.exitospring.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Data
public class CarDto {
    private Long id;
    private String brand;
    private String color;
    private String name;
    private String type;
    private String transmission;
    private String description;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String ownerName;
    private Long price;
    private Integer year;
    private MultipartFile image;
    private List<MultipartFile> images;
    private byte[] returnedImage;
    private List<byte[]> returnedImages;
}
