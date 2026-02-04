import api from '../../services/axios';
import type { PlayerPageResponse } from './player.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchPlayers = async (keyword?: string, page?: number, size?: number): Promise<BaseResponse<PlayerPageResponse>> => {
    const response = await api.get('/admin/player', {
        params: {
            keyword,
            page,
            size,
        },
    });

    return response.data;
};
