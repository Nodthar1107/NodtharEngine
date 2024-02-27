export interface IActivityBarItemDescriptor {
    /** Command title */
    title: string;

    /** Command id */
    id: string;

    /** Command group */
    category: string;

    /** Alternative text that using when icon doesn't exist */
    alter?: string;

    /** Path to icon */
    iconId?: string
}