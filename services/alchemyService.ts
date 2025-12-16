import { GoogleGenAI, Type } from "@google/genai";
import { Token, BridgeResult, MarketData, StakingInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

export const transmuteTokens = async (token: Token, amount: number): Promise<BridgeResult> => {
  const prompt = `
    You are a sarcastic, mystical blockchain alchemist. 
    A user is trying to "bridge" ${amount} ${token} (which are worthless testnet tokens) into Mainnet Value (Alchemical Gold).
    
    Invent a humorous, techno-babble, or magical reason why you are granting them "Alchemical Gold".
    
    The yield amount should be random but somewhat proportional to the input, multiplied by a 'chaos factor' (between 0.1 and 100).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            yieldAmount: { type: Type.NUMBER },
            story: { type: Type.STRING },
            transmutationType: { type: Type.STRING }
          },
          required: ["success", "yieldAmount", "story", "transmutationType"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response");
    return JSON.parse(resultText) as BridgeResult;

  } catch (error) {
    console.error("Transmutation failed:", error);
    return {
      success: false,
      yieldAmount: 0,
      story: "The alchemy furnace exploded due to high gas fees.",
      transmutationType: "Failed Experiment"
    };
  }
};

export const getMarketData = async (): Promise<MarketData> => {
  const prompt = `
    Generate 3 short, satirical financial news headlines (max 10 words each) for a fictional "Alchemical Gold" market.
    Topics: Wizards manipulating prices, testnet tokens crashing, void creatures trading, etc.
    Also pick a random trend: bullish, bearish, or chaotic.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketTrend: { type: Type.STRING, enum: ['bullish', 'bearish', 'chaotic'] }
          },
          required: ["headlines", "marketTrend"]
        }
      }
    });
    
    const data = JSON.parse(response.text || "{}");
    return {
      headlines: data.headlines || ["Market is confusing", "Gold is shiny", "HODL the void"],
      marketTrend: data.marketTrend || 'chaotic',
      goldPrice: Math.random() * 4000 + 1000
    };
  } catch (e) {
    return {
        headlines: ["Oracle disconnected", "Solar flare interference", "Buy the dip?"],
        marketTrend: 'chaotic',
        goldPrice: 1337.42
    }
  }
};

export const getStakingAPY = async (): Promise<StakingInfo> => {
    const prompt = `
      Generate a ridiculous APY percentage (number only) between 500 and 5000000 for a staking pool.
      And a short, 5-word reason why the yield is so high (e.g. "Ponzinomics v3 enabled").
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        apy: { type: Type.NUMBER },
                        reason: { type: Type.STRING }
                    },
                    required: ["apy", "reason"]
                }
            }
        });
        return JSON.parse(response.text || `{"apy": 9999, "reason": "System Error"}`);
    } catch (e) {
        return { apy: 69420, reason: "Inflationary Spiral" };
    }
};
