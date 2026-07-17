package id.co.sinergi.emergencyhub.common.enums;

/**
 * Jenis event yang bisa terjadi dari device.
 */
public enum EventType {

    // Fire Alarm Events
    FIRE_ALARM,
    SMOKE_DETECTED,
    HEAT_DETECTED,
    MANUAL_CALL_POINT,
    SPRINKLER_FLOW,

    // Gas Detection Events
    GAS_LEAK,
    GAS_LEVEL_HIGH,
    GAS_LEVEL_LOW,

    // Environmental Events
    WIND_SPEED,
    TEMPERATURE,
    HUMIDITY,

    // System Events
    DEVICE_ONLINE,
    DEVICE_OFFLINE,
    HEARTBEAT,
    DEVICE_FAULT,
    POWER_FAILURE,

    // CCTV Events
    CAMERA_ONLINE,
    CAMERA_OFFLINE,
    MOTION_DETECTED
}
