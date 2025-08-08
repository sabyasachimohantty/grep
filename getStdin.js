export default async function getStdin() {
    process.stdin.setEncoding('utf-8');
    try {
        let inputData = '';
        for await (const chunk of process.stdin) {
            inputData += chunk;
        }
        return inputData;
    } catch (error) {
        throw new Error(`Error while reading stdin: ${error}`);
    }
}