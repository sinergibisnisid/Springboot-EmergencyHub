package id.co.sinergi.emergencyhub.common.exception;

/**
 * Exception saat gagal koneksi atau komunikasi dengan device.
 */
public class DeviceConnectionException extends RuntimeException {

    private final String deviceId;
    private final String protocol;

    public DeviceConnectionException(String deviceId, String protocol, String message) {
        super(String.format("Device [%s] (%s): %s", deviceId, protocol, message));
        this.deviceId = deviceId;
        this.protocol = protocol;
    }

    public DeviceConnectionException(String deviceId, String protocol, String message, Throwable cause) {
        super(String.format("Device [%s] (%s): %s", deviceId, protocol, message), cause);
        this.deviceId = deviceId;
        this.protocol = protocol;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public String getProtocol() {
        return protocol;
    }
}
