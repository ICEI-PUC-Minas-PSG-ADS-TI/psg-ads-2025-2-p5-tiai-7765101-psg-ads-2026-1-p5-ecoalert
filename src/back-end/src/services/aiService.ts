import { GoogleGenerativeAI } from "@google/generative-ai"
import { AppError } from "@/types/error"

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export type WeatherReportMetrics = {
    periodLabel?: string
    currentTemperature?: number | string | null
    maxTemperature?: number | string | null
    minTemperature?: number | string | null
    totalRain?: number | string | null
    maxWindGust?: number | string | null
    averageWindSpeed?: number | string | null
    riskStatus?: string
    riskDescription?: string
    dataPoints?: number | string | null
    locationSource?: string
    generatedAt?: string
}

export class AIService {
    static async generateReportText(
        weatherData: any,
        neighborhood: string,
        metrics?: WeatherReportMetrics
    ): Promise<string> {
        try {
            let weatherSummary = ""

            if (weatherData && weatherData.hourly) {
                const {
                    time,
                    temperature_2m,
                    precipitation,
                    wind_speed_10m,
                    wind_gusts_10m
                } = weatherData.hourly

                weatherSummary = time.slice(-24).map((t: string, index: number) => {
                    const hour = new Date(t).getHours()
                    const gust = wind_gusts_10m?.[index]

                    return `Hora: ${hour}h | Temp: ${temperature_2m[index]}C | Chuva: ${precipitation[index]}mm | Vento: ${wind_speed_10m[index]}km/h${gust !== undefined ? ` | Rajada: ${gust}km/h` : ""}`
                }).join("\n")
            } else if (Array.isArray(weatherData)) {
                weatherSummary = weatherData.slice(-24).map((dataPoint: any) =>
                    `Hora: ${dataPoint.time || ""} | Temp: ${dataPoint.temperature || dataPoint.temperature_2m}C | Chuva: ${dataPoint.precipitation}mm | Vento: ${dataPoint.windSpeed || dataPoint.wind_speed_10m}km/h`
                ).join("\n")
            }

            const metricsSummary = formatMetrics(metrics)
            const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" })

            const prompt = `
            Voce e o assistente inteligente do sistema Nimbly, focado em seguranca ambiental e Defesa Civil em Belo Horizonte. Sua tarefa e analisar dados meteorologicos e metricas consolidadas para gerar um relatorio textual de monitoramento para o bairro "${neighborhood}".

            Dados meteorologicos consultados:
            ${weatherSummary || "Dados horarios nao informados."}

            Metricas consolidadas calculadas pela aplicacao:
            ${metricsSummary || "Metricas consolidadas nao informadas."}

            Instrucoes de resposta:
                - Escreva em portugues do Brasil de forma clara, objetiva e profissional.
                - Use formatacao Markdown com titulos iniciados por '###', topicos com '-' e termos importantes em **negrito**.
                - Use as metricas consolidadas como contexto principal quando elas estiverem informadas.
                - Nao invente valores numericos que nao estejam nos dados ou nas metricas.
                - O relatorio DEVE conter tres secoes claras:
                    1. Um resumo geral da situacao climatica no bairro.
                    2. Uma analise de risco baseada nos dados e nas metricas.
                    3. Recomendacoes e orientacoes de seguranca para os moradores.
            `

            const result = await model.generateContent(prompt)
            const response = await result.response
            return response.text()
        }
        catch(error) {
            console.log("Erro na API do Gemini", error)
            throw new AppError("Falha ao gerar texto descritivo com IA", 500, "AI_GENERATION_ERROR")
        }
    }
}

function formatMetrics(metrics?: WeatherReportMetrics): string {
    if (!metrics) {
        return ""
    }

    const lines = [
        formatMetric("Periodo analisado", metrics.periodLabel),
        formatMetric("Temperatura atual", metrics.currentTemperature, "C"),
        formatMetric("Temperatura maxima", metrics.maxTemperature, "C"),
        formatMetric("Temperatura minima", metrics.minTemperature, "C"),
        formatMetric("Chuva acumulada", metrics.totalRain, "mm"),
        formatMetric("Maior rajada de vento", metrics.maxWindGust, "km/h"),
        formatMetric("Vento medio", metrics.averageWindSpeed, "km/h"),
        formatMetric("Status de risco", metrics.riskStatus),
        formatMetric("Descricao do risco", metrics.riskDescription),
        formatMetric("Pontos de dados analisados", metrics.dataPoints),
        formatMetric("Origem da localizacao", metrics.locationSource),
        formatMetric("Gerado em", metrics.generatedAt)
    ].filter(Boolean)

    return lines.join("\n")
}

function formatMetric(label: string, value?: number | string | null, unit?: string): string {
    if (value === undefined || value === null || value === "") {
        return ""
    }

    return `- ${label}: ${value}${unit ? ` ${unit}` : ""}`
}
