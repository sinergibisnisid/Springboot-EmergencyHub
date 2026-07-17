package id.co.sinergi.emergencyhub.common.enums;

/**
 * Channel notifikasi yang didukung.
 */
public enum NotificationType {

    /** Email via SMTP */
    EMAIL,

    /** SMS via gateway */
    SMS,

    /** WhatsApp via API (Twilio/Fonnte/dll) */
    WHATSAPP,

    /** Push notification ke dashboard (WebSocket) */
    PUSH,

    /** Sirene/horn di area pabrik */
    SIREN
}
