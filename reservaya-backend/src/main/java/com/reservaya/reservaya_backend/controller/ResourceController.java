package com.reservaya.reservaya_backend.controller;

import com.reservaya.reservaya_backend.dto.ResourceDto;
import com.reservaya.reservaya_backend.service.ResourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recursos")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public List<ResourceDto> listar() {
        return resourceService.listAll();
    }
}
