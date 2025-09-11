package com.reservaya.reservaya_backend.dto;

import java.time.Instant;

public record ReservationRequest(
    Long resourceId,
    Long userId,
    String purpose,
    Instant startAt,
    Instant endAt) {
}