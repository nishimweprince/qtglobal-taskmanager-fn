export const capitalizeString = (string) => {
    if (!string) return "";
    const words = string.split("_");
    const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
};
