package com.reservaya.reservaya_backend.service.validation;

import com.reservaya.reservaya_backend.exception.BadRequestException;
import java.time.Instant;
import org.springframework.stereotype.Component;

@Component
public class ReservationTimeValidator {

  /**
   * Valida que el rango sea válido (start < end) y no nulo.
   * Aquí puedes añadir reglas adicionales (ej.: no permitir pasado, duraciones mínimas, etc.).
   */
  public void validate(Instant startAt, Instant endAt) {
    if (startAt == null || endAt == null) {
      throw new BadRequestException("La fecha/hora de inicio y fin son obligatorias");
    }
    if (!startAt.isBefore(endAt)) {
      throw new BadRequestException("El rango de tiempo es inválido (inicio debe ser menor que fin)");
    }
  }
}