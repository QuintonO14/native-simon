export default function timer(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}