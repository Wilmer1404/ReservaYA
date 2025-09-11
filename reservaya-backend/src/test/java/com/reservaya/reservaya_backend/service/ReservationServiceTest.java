package com.reservaya.reservaya_backend.service;

import com.reservaya.reservaya_backend.dto.ReservationRequest;
import com.reservaya.reservaya_backend.entity.AppUser;
import com.reservaya.reservaya_backend.entity.Resource;
import com.reservaya.reservaya_backend.entity.Reservation;
import com.reservaya.reservaya_backend.exception.ConflictException;
import com.reservaya.reservaya_backend.exception.NotFoundException;
import com.reservaya.reservaya_backend.repository.AppUserRepository;
import com.reservaya.reservaya_backend.repository.ResourceRepository;
import com.reservaya.reservaya_backend.repository.ReservationRepository;
import com.reservaya.reservaya_backend.service.validation.ReservationOverlapValidator;
import com.reservaya.reservaya_backend.service.validation.ReservationTimeValidator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    ReservationRepository reservationRepo;
    @Mock
    ResourceRepository resourceRepo;
    @Mock
    AppUserRepository userRepo;
    @Mock
    ReservationTimeValidator timeValidator;
    @Mock
    ReservationOverlapValidator overlapValidator;

    @InjectMocks
    ReservationService service;

    @Test
    void create_throwsNotFound_whenResourceMissing() {
        when(resourceRepo.findById(10L)).thenReturn(Optional.empty());

        var req = new ReservationRequest(10L, 1L, "Entrenamiento",
                Instant.parse("2024-12-15T14:00:00Z"),
                Instant.parse("2024-12-15T16:00:00Z"));

        assertThrows(NotFoundException.class, () -> service.create(req));
        
        // Verificar que se validó el tiempo antes de fallar
        verify(timeValidator, times(1)).validate(req.startAt(), req.endAt());
        // No debería haber interacciones con overlap validator ni repository save
        verifyNoInteractions(overlapValidator);
        verify(reservationRepo, never()).save(any());
    }

    @Test
    void create_throwsConflict_whenOverlap() {
        var resource = new Resource();
        resource.setId(10L);
        resource.setName("Cancha");
        var user = new AppUser();
        user.setId(1L);
        user.setEmail("maria@u.edu");

        when(resourceRepo.findById(10L)).thenReturn(Optional.of(resource));
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));

        doNothing().when(timeValidator).validate(any(), any());
        doThrow(new ConflictException("overlap")).when(overlapValidator)
                .validateNoOverlap(eq(10L), any(), any());

        var req = new ReservationRequest(10L, 1L, "Entrenamiento",
                Instant.parse("2024-12-15T14:00:00Z"),
                Instant.parse("2024-12-15T16:00:00Z"));

        assertThrows(ConflictException.class, () -> service.create(req));
        verify(reservationRepo, never()).save(any());
    }

    @Test
    void create_ok_whenNoOverlap() {
        var resource = new Resource();
        resource.setId(10L);
        resource.setName("Cancha");
        var user = new AppUser();
        user.setId(1L);
        user.setEmail("maria@u.edu");

        when(resourceRepo.findById(10L)).thenReturn(Optional.of(resource));
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));

        doNothing().when(timeValidator).validate(any(), any());
        doNothing().when(overlapValidator).validateNoOverlap(eq(10L), any(), any());

        when(reservationRepo.save(any(Reservation.class))).thenAnswer(inv -> {
            Reservation r = inv.getArgument(0);
            r.setId(99L);
            return r;
        });

        var req = new ReservationRequest(10L, 1L, "Entrenamiento",
                Instant.parse("2024-12-15T14:00:00Z"),
                Instant.parse("2024-12-15T16:00:00Z"));

        var resp = service.create(req);

        assertNotNull(resp);
        assertEquals(99L, resp.id());
        assertEquals("Cancha", resp.resourceName());
        verify(reservationRepo, times(1)).save(any(Reservation.class));
    }
}