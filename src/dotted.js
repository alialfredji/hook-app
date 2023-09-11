/**
 * Minimalistic Interface to Dot-Access an Object
 *
 */

const scalars = [
    'number',
    'string',
    'boolean',
];

const dottedSet = (source, path, value) => {
    if (scalars.includes(typeof source)) {
        return value;
    }

    if (!source) {
        return dottedSet({}, path, value);
    }

    const tokens = path.split('.');
    const setKey = tokens.pop();
    
    // get a reference to the deeper layer represented by the path
    const target = tokens.reduce((curr, key) => {
        return curr[key] = curr[key] || {}; 
    }, source);
    
    // set the value at the requested key level
    target[setKey] = value;

    return source;
};

const dotted = (source, path) => {
    if (!path) {
        return source;
    }

    // eslint-disable-next-line
    return path.split('.').reduce((curr, key) => {
        if (key[0] !== '$') {
            return curr[key];
        }

        if (key === '$JSON') {
            return JSON.stringify(curr);
        }
        
        if (key === '$LENGTH') {
            return curr.length;
        }
        
        if (key === '$FIRST') {
            return curr[0];
        }

        if (key === '$LAST') {
            return curr[curr.length - 1];
        }

        if (Array.isArray(curr)) {
            const idx = parseInt(key.substr(1, key.length), 10);
            return curr[idx];
        }
    }, source);
};

dotted.set = dottedSet;

module.exports = dotted;
