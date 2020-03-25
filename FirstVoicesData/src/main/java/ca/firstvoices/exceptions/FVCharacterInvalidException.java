package ca.firstvoices.exceptions;

import org.nuxeo.ecm.core.api.NuxeoException;

public class FVCharacterInvalidException extends NuxeoException {

    public FVCharacterInvalidException() {
    }

    public FVCharacterInvalidException(int statusCode) {
        super(statusCode);
    }

    public FVCharacterInvalidException(String message) {
        super(message);
    }

    public FVCharacterInvalidException(String message, int statusCode) {
        super(message, statusCode);
    }

    public FVCharacterInvalidException(String message, Throwable cause) {
        super(message, cause);
    }

    public FVCharacterInvalidException(String message, Throwable cause, int statusCode) {
        super(message, cause, statusCode);
    }

    public FVCharacterInvalidException(Throwable cause) {
        super(cause);
    }

    public FVCharacterInvalidException(Throwable cause, int statusCode) {
        super(cause, statusCode);
    }

}
