export default async function apiCall(prompt, temperature) {
    try {
        const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt, temperature: temperature })
    });

    const data = await response.json()
    console.log('data', data)
    return data.reply
    } catch(error) {
        console.log(error.stack)
    }
    
}