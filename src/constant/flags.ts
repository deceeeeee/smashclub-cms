export const STATUS_FLAGS = {
    ACTIVE: 1,
    INACTIVE: 0,
};

export const STATUS_OPTIONS = [
    { label: 'Aktif', value: STATUS_FLAGS.ACTIVE },
    { label: 'Non-Aktif', value: STATUS_FLAGS.INACTIVE },
];

export const getStatusLabel = (status: number) => {
    return status === STATUS_FLAGS.ACTIVE ? 'Aktif' : 'Non-Aktif';
};
