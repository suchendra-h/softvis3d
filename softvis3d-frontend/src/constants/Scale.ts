export default class Scale implements SelectOptionValue {

    private key: string;
    private label: string;

    constructor(key: string, label: string) {
        this.key = key;
        this.label = label;
    }

    public getLabel(): string {
        return this.label;
    }

}
