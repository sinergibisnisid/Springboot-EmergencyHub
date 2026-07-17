package id.co.sinergi.emergencyhub.integration.adapter;

import id.co.sinergi.emergencyhub.common.dto.NormalizedEvent;
import id.co.sinergi.emergencyhub.integration.entity.DeviceConfig;

/**
 * Interface adapter per-protokol.
 *
 * <p>Setiap protokol (Modbus, MQTT, ONVIF) mengimplementasikan interface ini
 * sehingga integration layer bersifat modular — bukan monolitik.
 * Ini penting karena ada 8 panel beda merek yang mungkin pakai
 * konfigurasi berbeda-beda.
 */
public interface ProtocolAdapter {

    /**
     * Baca data dari device dan konversi ke NormalizedEvent.
     *
     * @param config konfigurasi device (IP, port, register map, dll)
     * @return event ter-normalisasi, atau null jika tidak ada event baru
     */
    NormalizedEvent read(DeviceConfig config);

    /**
     * Buka koneksi ke device.
     *
     * @param config konfigurasi device
     */
    void connect(DeviceConfig config);

    /**
     * Tutup koneksi ke device.
     *
     * @param config konfigurasi device
     */
    void disconnect(DeviceConfig config);

    /**
     * Cek apakah koneksi ke device masih aktif.
     *
     * @param config konfigurasi device
     * @return true jika connected
     */
    boolean isConnected(DeviceConfig config);

    /**
     * Mendapatkan nama protokol yang ditangani adapter ini.
     *
     * @return nama protokol (e.g., "MODBUS", "MQTT")
     */
    String getProtocolName();
}
