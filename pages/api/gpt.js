export default async function handler(req, res) {
    console.log("Asking chatGPT");
    let prompt = req.body.prompt;
    let temperature = req.body.temperature;
    console.log(prompt)
    console.log(temperature)
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',  
      headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: prompt,
          temperature: temperature,
        }),
      });
      console.log(`response ${JSON.stringify(response)}`)

      const data = await response.json();
      console.log(`data ${JSON.stringify(data)}`)
      const reply = data.choices[0].message.content;
      res.status(200).json({ reply: reply });
    } catch (error) {
      console.log(`error.message ${error.message}`)
      res.status(500).json({ message: error.message });
    }
  }