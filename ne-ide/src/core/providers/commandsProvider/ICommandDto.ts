export interface ICommandDto {
    /** Command title */
    title: string;

    /** Command id */
    id: string;

    context: string;

    /** Command group */
    category?: string;

    /** Path to icon */
    iconId?: string;
}