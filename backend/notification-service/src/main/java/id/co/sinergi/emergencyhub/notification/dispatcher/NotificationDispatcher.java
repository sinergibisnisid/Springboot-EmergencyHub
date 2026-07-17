package id.co.sinergi.emergencyhub.notification.dispatcher;

import id.co.sinergi.emergencyhub.alarm.entity.Alarm;

/**
 * Interface untuk dispatch notifikasi ke berbagai channel.
 * Setiap implementasi menangani satu channel (Email, SMS, WA).
 */
public interface NotificationDispatcher {

    /**
     * Kirim notifikasi untuk alarm tertentu.
     *
     * @param alarm alarm yang perlu dikirimkan notifikasinya
     */
    void dispatch(Alarm alarm);

    /**
     * Nama channel notifikasi.
     *
     * @return nama channel (EMAIL, SMS, WHATSAPP, dll)
     */
    String getChannelName();

    /**
     * Cek apakah channel ini enabled.
     *
     * @return true jika enabled
     */
    boolean isEnabled();
}
