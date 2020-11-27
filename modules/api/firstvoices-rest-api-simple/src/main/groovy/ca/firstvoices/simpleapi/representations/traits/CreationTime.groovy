package ca.firstvoices.simpleapi.representations.traits

import io.swagger.v3.oas.annotations.media.Schema

import java.time.LocalDateTime

trait CreationTime {
    @Schema(
        description='Last modification time',
        readOnly = true
    )
    LocalDateTime lastModified
}
