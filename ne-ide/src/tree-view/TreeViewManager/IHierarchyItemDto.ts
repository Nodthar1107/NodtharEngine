export interface IHierarchyItemDto {
    label: string;

    id: string;

    uri: string;

    children?: IHierarchyItemDto[];

    iconId?: string;
}