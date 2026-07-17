package id.co.sinergi.emergencyhub.common.enums;

/**
 * Status lifecycle sebuah alarm.
 */
public enum AlarmStatus {

    /** Alarm baru terjadi, belum di-acknowledge operator */
    ACTIVE,

    /** Operator sudah acknowledge, tapi belum resolved */
    ACKNOWLEDGED,

    /** Alarm sudah di-resolve (kondisi normal kembali) */
    RESOLVED,

    /** Alarm ditutup secara manual oleh supervisor */
    CLOSED,

    /** False alarm — event diabaikan */
    FALSE_ALARM
}
