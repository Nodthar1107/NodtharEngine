export class Debouncer {
    private timer: number | null;

    constructor() {
        this.timer = null;
    }

    public execute(callback: () => void, delay: number) {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            callback();

            this.timer = null;
        }, delay);
    }
}