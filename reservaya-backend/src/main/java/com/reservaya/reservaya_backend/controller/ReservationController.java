package com.reservaya.reservaya_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.reservaya.reservaya_backend.dto.ReservationRequest;
import com.reservaya.reservaya_backend.dto.ReservationResponse;
import com.reservaya.reservaya_backend.service.ReservationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ReservationController {
    private final ReservationService service;

    public ReservationController(ReservationService s) {
        this.service = s;
    }

    // POST /reservas
    @PostMapping("/reservas")
    public ResponseEntity<ReservationResponse> create(@Valid @RequestBody ReservationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    // GET /reservas?userId=1
    @GetMapping("/reservas")
    public List<ReservationResponse> byUser(@RequestParam Long userId) {
        return service.findByUser(userId);
    }

    // PUT /reservas/{id}
    @PutMapping("/reservas/{id}")
    public ReservationResponse update(@PathVariable Long id, @Valid @RequestBody ReservationRequest req) {
        return service.update(id, req);
    }

    // DELETE /reservas/{id}
    @DeleteMapping("/reservas/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        service.cancel(id);
        return ResponseEntity.noContent().build();
    }
}