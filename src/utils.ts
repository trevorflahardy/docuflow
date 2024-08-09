/**
 * Fetches a JSON file and returns it as an object.
 * 
 * @param {string} file The configuration file to fetch.
 * @returns {Promise<Object>} The configuration object.
 */
export async function fetchFromJson(file: string): Promise<Object> {
    const response = await fetch(file)
    const config = await response.json()
    return config
}

