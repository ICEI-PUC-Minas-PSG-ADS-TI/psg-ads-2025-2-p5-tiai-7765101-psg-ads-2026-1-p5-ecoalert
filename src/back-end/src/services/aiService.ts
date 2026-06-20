import {GoogleGenerativeAI} from "@google/generative-ai"
import {AppError} from "@/types/error"

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ""); 

export class AIService {
    static async generateReportText(weatherData: any, neighborhood: string): Promise<string> {
        try {
            let weatherSummary = "";

            if(weatherData && weatherData.hourly){
                const {time, temperature_2m, precipitation, wind_speed_10m} = weatherData.hourly

                weatherSummary = time.slice(-24).map((t: string, index: number) => {

                    const hour = new Date(t).getHours()

                    return `Hora: ${hour}h | Temp: ${temperature_2m[index]}°C | Chuva: ${precipitation[index]}mm |Vento: ${wind_speed_10m[index]}km/h`
                }).join("\n")
            } else if(Array.isArray(weatherData)){
                weatherSummary = weatherData.slice(-24).map((d: any) => 
                `Hora: ${d.time || ''} | Temp: ${d.temperature || d.temperature_2m}°C | Chuva: ${d.precipitation}mm | Vento: ${d.windSpeed || d.wind_speed_10m}km/h`
                ).join("\n");
            }
            const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `
            Você é o assistente inteligente do sistema Nimbly, focado em segurança ambiental e Defesa Civil em Belo Horizonte.Sua tarefa é analisar os dados meteorológicos das últimas 24 horas fornecidos abaixo e gerar um relatório textual de monitoramento para o bairro "${neighborhood}".
            
            Dados meteorológicos das últimas 24 horas: ${weatherSummary}
            

            Instruções de formatação do texto:
                - Escreva em português do Brasil de forma clara, objetiva e profissional.
                - Use formatação Markdown (títulos com '###', tópicos com '-' e termos importantes em negrito).
                - O relatório DEVE conter três seções claras:
                    1. Um resumo geral da situação climática recente no bairro.
                    2. Uma análise de risco baseada nos dados (ex: se o volume de chuva indica risco de alagamento ou deslizamento, ou se os ventos estão calmos).
                    3. Recomendações e orientações de segurança para os moradores.
            `

            const result = await model.generateContent(prompt)
            const response = await result.response
            return response.text()

        }
        catch(error) {
            console.log("Erro na API do Gemini", error);
            throw new AppError("Falha ao gerar texto descritivo com IA", 500, "AI_GENERATION_ERROR");
        }
    }
}
