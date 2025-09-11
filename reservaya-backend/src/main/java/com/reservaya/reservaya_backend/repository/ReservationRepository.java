package com.reservaya.reservaya_backend.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.reservaya.reservaya_backend.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Query que valida solapamiento temporal usando JPQL con campos separados
    @Query("""
               select count(res) > 0 from Reservation res
               where res.resource.id = :resourceId
                 and res.status in ('PENDING','CONFIRMED')
                 and res.startTime < :endAt
                 and res.endTime > :startAt
            """)
    boolean existsOverlap(
            @Param("resourceId") Long resourceId,
            @Param("startAt") Instant startAt,
            @Param("endAt") Instant endAt);

    // Método para validar solapamiento excluyendo una reserva específica (útil para updates)
    @Query("""
               select count(res) > 0 from Reservation res
               where res.resource.id = :resourceId
                 and res.id != :reservationId
                 and res.status in ('PENDING','CONFIRMED')
                 and res.startTime < :endAt
                 and res.endTime > :startAt
            """)
    boolean existsOverlapExcludingId(
            @Param("reservationId") Long reservationId,
            @Param("resourceId") Long resourceId,
            @Param("startAt") Instant startAt,
            @Param("endAt") Instant endAt);
            
    // Método para obtener reservas de un usuario con relaciones cargadas
    @Query("""
               select r from Reservation r
               join fetch r.resource res
               join fetch r.user u
               where u.id = :userId
               order by r.startTime desc
            """)
    List<Reservation> findByUserIdWithDetails(@Param("userId") Long userId);
}