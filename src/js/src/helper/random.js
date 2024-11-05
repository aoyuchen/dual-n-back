// Generate a random integer between [min, max], inclusive
export function generateRandNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
