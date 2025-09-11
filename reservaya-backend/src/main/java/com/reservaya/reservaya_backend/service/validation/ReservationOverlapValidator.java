package com.reservaya.reservaya_backend.service.validation;

import com.reservaya.reservaya_backend.exception.ConflictException;
import com.reservaya.reservaya_backend.repository.ReservationRepository;
import java.time.Instant;
import org.springframework.stereotype.Component;

@Component
public class ReservationOverlapValidator {

    private final ReservationRepository reservationRepo;

    public ReservationOverlapValidator(ReservationRepository reservationRepo) {
        this.reservationRepo = reservationRepo;
    }

    /**
     * Verifica que NO exista solapamiento para el recurso indicado.
     */
    public void validateNoOverlap(Long resourceId, Instant startAt, Instant endAt) {
        boolean overlaps = reservationRepo.existsOverlap(resourceId, startAt, endAt);
        if (overlaps) {
            throw new ConflictException("El recurso ya está reservado en ese horario");
        }
    }

    /**
     * Igual que el anterior pero excluyendo una reserva (para update).
     */
    public void validateNoOverlapExcluding(Long reservationId, Long resourceId, Instant startAt, Instant endAt) {
        boolean overlaps = reservationRepo.existsOverlapExcludingId(reservationId, resourceId, startAt, endAt);
        if (overlaps) {
            throw new ConflictException("El recurso ya está reservado en ese horario");
        }
    }
}