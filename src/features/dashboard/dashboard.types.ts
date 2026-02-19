export interface DailyTransactionCount {
    createdAt: string;
    transactionCount: number;
}

export interface RecentTransaction {
    fullName: string;
    transactionLabel: string;
    status: number;
    statusDesc: string;
    startTime: string;
}

export interface DashboardStats {
    courtCount: number;
    coachCount: number;
    transactionCount: number;
    dailyTransactionCount: DailyTransactionCount[];
    dailyTransaction: RecentTransaction[];
}

export interface DashboardResponse {
    data: DashboardStats;
    success: boolean;
    status: number;
    message: string;
    timestamp: string;
}
