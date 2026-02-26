export const ORDER_STATUS_FLAGS = {
    CANCELLED: 0,
    PAYMENT_PENDING: 1,
    PROCESSING: 2,
    READY_FOR_PICKUP: 3,
    COMPLETED: 4,
};

export const ORDER_STATUS_OPTIONS = [
    // { label: 'Menunggu Pembayaran', value: ORDER_STATUS_FLAGS.PAYMENT_PENDING },
    // { label: 'Diproses', value: ORDER_STATUS_FLAGS.PROCESSING },
    { label: 'Siap Diambil', value: ORDER_STATUS_FLAGS.READY_FOR_PICKUP },
    { label: 'Selesai', value: ORDER_STATUS_FLAGS.COMPLETED },
    { label: 'Dibatalkan', value: ORDER_STATUS_FLAGS.CANCELLED },
];

export const getStatusLabel = (status: number) => {
    return status === ORDER_STATUS_FLAGS.CANCELLED ? 'Dibatalkan' :
        // status === ORDER_STATUS_FLAGS.PAYMENT_PENDING ? 'Menunggu Pembayaran' :
        //     status === ORDER_STATUS_FLAGS.PROCESSING ? 'Diproses' :
        status === ORDER_STATUS_FLAGS.READY_FOR_PICKUP ? 'Siap Diambil' :
            status === ORDER_STATUS_FLAGS.COMPLETED ? 'Selesai' : 'Tidak Diketahui';
};