package com.reservaya.reservaya_backend.mapper;

import org.springframework.stereotype.Component;

import com.reservaya.reservaya_backend.dto.CategoryDto;
import com.reservaya.reservaya_backend.dto.ResourceDto;
import com.reservaya.reservaya_backend.entity.Category;
import com.reservaya.reservaya_backend.entity.Resource;

@Component
public class ResourceMapper {

    public ResourceDto toDto(Resource r) {
        Category c = r.getCategory();
        CategoryDto cd = (c != null) ? new CategoryDto(c.getId(), c.getName()) : null;

        return new ResourceDto(
                r.getId(),
                r.getName(),
                r.getDescription(),
                r.getLocation(),
                r.getCapacity(),
                r.getHourlyPrice(),
                cd);
    }
}
