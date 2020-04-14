type Subscriber<T> = (value: T) => void;

export class Emitter<T> {
    private subscribers: Subscriber<T>[] = [];

    public subscribe(subscriber: Subscriber<T>) {
        this.subscribers.push(subscriber);
    }

    public emit(value: T) {
        for (let subscriber of this.subscribers) {
            subscriber(value);
        }
    }
}