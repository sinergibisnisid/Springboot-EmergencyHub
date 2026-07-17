package id.co.sinergi.emergencyhub.common.enums;

/**
 * Protokol komunikasi yang didukung oleh platform.
 */
public enum DeviceProtocol {

    /** Modbus TCP — koneksi ke panel fire alarm & PLC */
    MODBUS,

    /** MQTT — koneksi ke IoT gateway & sensor */
    MQTT,

    /** ONVIF — koneksi ke CCTV/IP Camera */
    ONVIF,

    /** Dry Contact — koneksi langsung via digital I/O */
    DRY_CONTACT,

    /** Manual — input manual dari operator */
    MANUAL
}
