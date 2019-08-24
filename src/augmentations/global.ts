export {};

declare global {
    interface Map<K, V> {
        getset<TValue extends V>(key: K, value: TValue): V | TValue;
    }
}

Map.prototype.getset = function (key, value) {
    if (this.has(key)) return this.get(key);
    this.set(key, value);
    return value;
};
