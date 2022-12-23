function toCapitalizedWords(name) {
    var words = name.match(/[A-Za-z][a-z]*/g) || [];

    return words.map(capitalize).join(" ");
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

// TODO: We only acknowledge top level string properties at the moment.
// We should probably have a whitelist of approved traits.
export function extractTraits(properties) {

    const result = Object.keys(properties).map(key => {
        if (properties[key] instanceof String || typeof properties[key] === 'string') {
            return [toCapitalizedWords(key), properties[key]]
        }

        return [key, null];
    });

    return result.filter(([key, value]) => value);
}