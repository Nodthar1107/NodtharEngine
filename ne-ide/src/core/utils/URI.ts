export class URI {
    public readonly path: string;
    public readonly resourceName: string;
    public readonly extension?: string;

    public static createURI(path: string, resourceName: string, extension?: string): URI {
        return new URI(path, resourceName, extension);
    }

    public static createURIFromString(uri: string): URI {
        const path = URI.getResourcePath(uri);
        const resourceName = URI.getResourceLabel(uri);
        const extension = URI.getResourceExtension(uri);

        console.log('Create uri from string', path, resourceName, extension);

        return new URI(path, resourceName, extension);
    }

    public static isResourceUri(uri: string): boolean {
        return new RegExp(/.*\.\w+$/).test(uri);
    }
    
    public static getResourceLabel(uri: string): string {
        const label = uri.split('/').reverse()[0];
        const extension = this.getResourceExtension(uri);
        
        return extension ? label.replace(`.${extension}`, '') : label
    }

    public static getResourcePath(uri: string): string {
        if (!uri.includes('/')) {
            return '';
        }

        let path = '';
        if (URI.isResourceUri(uri)) {
            path = uri.replace(/\/?[\wа-яА-Я ]+\.\w+$/, '');
        } else {
            path = uri.split('/').slice(0, -1).join('/');
        }
        
        return path === '' ? '/' : path;
    }

    public static getResourceExtension(uri: string): string | undefined {
        return new RegExp(/\.\w+$/).exec(uri)?.[0].replace('.', '') || undefined;
    }

    public static resolvePath(path: string, uri: URI) {
        return new URI(path, uri.resourceName, uri.extension);
    }

    private constructor(path: string, resourceName: string, extension?: string) {
        this.path = path;
        this.resourceName = resourceName;
        this.extension = extension;
    }

    public isResource(): boolean {
        return this.resourceName !== undefined && this.extension !== undefined;
    }

    public toString(): string {
        if (this.path === '/' && this.resourceName === '') {
            return '/';
        }

        let constrcutedUri = (this.path === '/' ? '/' : this.path + '/') + this.resourceName;

        if (this.extension) {
            constrcutedUri += '.' + this.extension;
        }

        return constrcutedUri;
    }

    public equals(other: URI): boolean {
        return this.path === other.path &&
            this.resourceName === other.resourceName &&
            this.extension === this.extension;
    }
}
