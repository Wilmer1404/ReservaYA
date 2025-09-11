package com.reservaya.reservaya_backend.dto;

import java.math.BigDecimal;

public record ResourceDto(
    Long id,
    String name,
    String description,
    String location,
    Integer capacity,
    BigDecimal hourlyPrice,
    CategoryDto category
) {}
