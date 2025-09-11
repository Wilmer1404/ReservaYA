package com.reservaya.reservaya_backend.dto;

import java.time.Instant;

public record ReservationResponse(
    Long id, Long resourceId, Long userId,
    String resourceName, String status,
    Instant startAt, Instant endAt, String purpose) {
}