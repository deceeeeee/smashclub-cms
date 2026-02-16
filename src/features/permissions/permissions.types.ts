export interface Menu {
    id: number;
    menuCode: string;
    menuName: string;
    parentId: number;
}

export interface Permission {
    id: number;
    permissionName: string;
    menu: Menu;
}
