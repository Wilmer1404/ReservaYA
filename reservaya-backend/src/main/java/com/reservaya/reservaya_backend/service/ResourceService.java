package com.reservaya.reservaya_backend.service;

import com.reservaya.reservaya_backend.dto.ResourceDto;
import com.reservaya.reservaya_backend.mapper.ResourceMapper;
import com.reservaya.reservaya_backend.repository.ResourceRepository;
import com.reservaya.reservaya_backend.entity.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper mapper;

    public ResourceService(ResourceRepository resourceRepository, ResourceMapper mapper) {
        this.resourceRepository = resourceRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ResourceDto> listAll() {
        // Variante 1 (con EntityGraph sobre findAll)
        List<Resource> resources = resourceRepository.findAll();

        // Variante 2 (si usas el método JPQL):
        // List<Resource> resources = resourceRepository.findAllWithCategory();

        return resources.stream().map(mapper::toDto).toList();
    }
}
