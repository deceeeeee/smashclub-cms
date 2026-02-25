export const BOOKING_STATUS_FLAGS = {
    CANCELLED: 0,
    PENDING: 1,
    CONFIRMED: 2,
    ONGOING: 3,
    COMPLETED: 4,
};

export const BOOKING_STATUS_OPTIONS = [
    // { label: 'Pending', value: BOOKING_STATUS_FLAGS.PENDING },
    // { label: 'Dikonfirmasi', value: BOOKING_STATUS_FLAGS.CONFIRMED },
    { label: 'Sedang Berlangsung', value: BOOKING_STATUS_FLAGS.ONGOING },
    { label: 'Selesai', value: BOOKING_STATUS_FLAGS.COMPLETED },
    { label: 'Dibatalkan', value: BOOKING_STATUS_FLAGS.CANCELLED },
];

export const getStatusLabel = (status: number) => {
    return status === BOOKING_STATUS_FLAGS.CANCELLED ? 'Dibatalkan' :
        status === BOOKING_STATUS_FLAGS.PENDING ? 'Pending' :
            status === BOOKING_STATUS_FLAGS.CONFIRMED ? 'Dikonfirmasi' :
                status === BOOKING_STATUS_FLAGS.ONGOING ? 'Sedang Berlangsung' :
                    status === BOOKING_STATUS_FLAGS.COMPLETED ? 'Selesai' : 'Tidak Diketahui';
};