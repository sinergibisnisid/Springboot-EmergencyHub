package id.co.sinergi.emergencyhub.common.exception;

/**
 * Exception saat terjadi error dalam pemrosesan alarm (rule evaluation, korelasi, dll).
 */
public class AlarmProcessingException extends RuntimeException {

    private final String alarmId;

    public AlarmProcessingException(String message) {
        super(message);
        this.alarmId = null;
    }

    public AlarmProcessingException(String alarmId, String message) {
        super(String.format("Alarm [%s]: %s", alarmId, message));
        this.alarmId = alarmId;
    }

    public AlarmProcessingException(String alarmId, String message, Throwable cause) {
        super(String.format("Alarm [%s]: %s", alarmId, message), cause);
        this.alarmId = alarmId;
    }

    public String getAlarmId() {
        return alarmId;
    }
}
