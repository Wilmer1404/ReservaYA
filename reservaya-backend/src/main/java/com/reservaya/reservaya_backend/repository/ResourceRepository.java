package com.reservaya.reservaya_backend.repository;

import com.reservaya.reservaya_backend.entity.Resource;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Variante 1 (simple con EntityGraph sobre findAll)
    @Override
    @EntityGraph(attributePaths = "category")
    @NonNull
    List<Resource> findAll();
}