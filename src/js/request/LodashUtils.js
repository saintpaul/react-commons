// Functions taken from lodash 4.5.1 to keep backward compatibility for old projects
export default class LodashUtils {

    static chunk(array, size) {
        const length = array ? array.length : 0;
        if(!length || size < 1) {
            return [];
        }
        let index = 0,
            resIndex = -1,
            result = new Array(Math.ceil(length / size));

        while (index < length) {
            result[++resIndex] = array.slice(index, (index += size));
        }
        return result;
    }
}