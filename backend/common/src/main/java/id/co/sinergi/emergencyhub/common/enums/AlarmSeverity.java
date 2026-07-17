package id.co.sinergi.emergencyhub.common.enums;

/**
 * Tingkat keparahan alarm.
 */
public enum AlarmSeverity {

    /** Informational — event normal, tidak butuh aksi */
    INFO,

    /** Warning — perlu perhatian operator, belum kritis */
    WARNING,

    /** Critical — perlu tindakan segera */
    CRITICAL,

    /** Emergency — keadaan darurat, evakuasi/shutdown diperlukan */
    EMERGENCY
}
