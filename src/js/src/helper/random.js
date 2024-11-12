// Generate a random integer between [min, max], inclusive
export function generateRandNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePermutation() {
    const digits = Array.from({ length: 9 }, (_, i) => i + 1); // [1, 2, ..., 9]

    // Fisher-Yates Shuffle
    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]]; // Swap elements
    }

    return digits;
}
