package com.reservaya.reservaya_backend.service.validation;

import com.reservaya.reservaya_backend.exception.BadRequestException;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class ReservationTimeValidatorTest {

    private final ReservationTimeValidator validator = new ReservationTimeValidator();

    @Test
    void validate_ok_whenStartBeforeEnd() {
        assertDoesNotThrow(() -> validator.validate(
                Instant.parse("2024-12-15T14:00:00Z"),
                Instant.parse("2024-12-15T16:00:00Z")));
    }

    @Test
    void validate_throws_whenEqualOrAfter() {
        assertThrows(BadRequestException.class, () -> validator.validate(
                Instant.parse("2024-12-15T16:00:00Z"),
                Instant.parse("2024-12-15T16:00:00Z")));
        assertThrows(BadRequestException.class, () -> validator.validate(
                Instant.parse("2024-12-15T18:00:00Z"),
                Instant.parse("2024-12-15T16:00:00Z")));
    }
}
