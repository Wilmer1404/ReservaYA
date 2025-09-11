package com.reservaya.reservaya_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.reservaya.reservaya_backend.dto.ReservationRequest;
import com.reservaya.reservaya_backend.dto.ReservationResponse;
import com.reservaya.reservaya_backend.entity.Reservation;
import com.reservaya.reservaya_backend.exception.NotFoundException;
import com.reservaya.reservaya_backend.repository.AppUserRepository;
import com.reservaya.reservaya_backend.repository.ReservationRepository;
import com.reservaya.reservaya_backend.repository.ResourceRepository;
import com.reservaya.reservaya_backend.service.validation.ReservationOverlapValidator;
import com.reservaya.reservaya_backend.service.validation.ReservationTimeValidator;

import jakarta.transaction.Transactional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepo;
    private final ResourceRepository resourceRepo;
    private final AppUserRepository userRepo;
    private final ReservationTimeValidator timeValidator;
    private final ReservationOverlapValidator overlapValidator;

    public ReservationService(ReservationRepository rr, ResourceRepository rrepo, AppUserRepository urepo,
                             ReservationTimeValidator timeValidator, ReservationOverlapValidator overlapValidator) {
        this.reservationRepo = rr;
        this.resourceRepo = rrepo;
        this.userRepo = urepo;
        this.timeValidator = timeValidator;
        this.overlapValidator = overlapValidator;
    }

    @Transactional
    public ReservationResponse create(ReservationRequest req) {
        // Validar tiempo
        timeValidator.validate(req.startAt(), req.endAt());
        
        var resource = resourceRepo.findById(req.resourceId())
                .orElseThrow(() -> new NotFoundException("Recurso no encontrado"));
        var user = userRepo.findById(req.userId())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        // Validar solapamiento
        overlapValidator.validateNoOverlap(resource.getId(), req.startAt(), req.endAt());

        var res = new Reservation();
        res.setUser(user);
        res.setResource(resource);
        res.setPurpose(req.purpose());
        // guardar como tsrange:
        String range = String.format("[%s,%s)", req.startAt(), req.endAt());
        res.setTimeRange(range);
        // También guardar en campos separados para facilitar consultas
        res.setStartTime(req.startAt());
        res.setEndTime(req.endAt());
        res.setStatus("CONFIRMED");

        var saved = reservationRepo.save(res);
        return new ReservationResponse(
                saved.getId(), resource.getId(), user.getId(),
                resource.getName(), saved.getStatus(),
                req.startAt(), req.endAt(), saved.getPurpose());
    }

    public List<ReservationResponse> findByUser(Long userId) {
        var reservations = reservationRepo.findByUserIdWithDetails(userId);
        return reservations.stream()
                .map(reservation -> new ReservationResponse(
                        reservation.getId(),
                        reservation.getResource().getId(),
                        reservation.getUser().getId(),
                        reservation.getResource().getName(),
                        reservation.getStatus(),
                        reservation.getStartTime(),
                        reservation.getEndTime(),
                        reservation.getPurpose()
                ))
                .toList();
    }

    @Transactional
    public ReservationResponse update(Long id, ReservationRequest req) {
        // Validar tiempo
        timeValidator.validate(req.startAt(), req.endAt());
        
        var reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservación no encontrada"));
        
        var resource = resourceRepo.findById(req.resourceId())
                .orElseThrow(() -> new NotFoundException("Recurso no encontrado"));
        var user = userRepo.findById(req.userId())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        // Validación de solapamiento excluyendo la reservación actual
        overlapValidator.validateNoOverlapExcluding(id, resource.getId(), req.startAt(), req.endAt());

        // Actualizar la reservación
        reservation.setUser(user);
        reservation.setResource(resource);
        reservation.setPurpose(req.purpose());
        String range = String.format("[%s,%s)", req.startAt(), req.endAt());
        reservation.setTimeRange(range);
        // También actualizar campos separados
        reservation.setStartTime(req.startAt());
        reservation.setEndTime(req.endAt());

        var saved = reservationRepo.save(reservation);
        return new ReservationResponse(
                saved.getId(), resource.getId(), user.getId(),
                resource.getName(), saved.getStatus(),
                req.startAt(), req.endAt(), saved.getPurpose());
    }

    @Transactional
    public void cancel(Long id) {
        var res = reservationRepo.findById(id).orElseThrow(() -> new NotFoundException("No existe"));
        res.setStatus("CANCELED");
        reservationRepo.save(res);
    }
}
