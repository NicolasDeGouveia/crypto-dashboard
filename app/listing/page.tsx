import { COINGECKO_API_KEY, COINGECKO_BASE_URL, COINS } from "../_lib/constants";
import { CoinPriceResponse } from "../_lib/types";

const page = async () => {
    let data: CoinPriceResponse | null = null 
    try {
        const ids = COINS.map(coin => coin.id).join(',');
        const res = await fetch(`${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
            {
                headers: {
                    "x-cg-pro-api-key": `${COINGECKO_API_KEY}`
                },
                next: { revalidate: 60 }
            }
        )
        data = await res.json() 
        console.log(data);
    } catch (error) {
        console.error(error)
    }

    return (
        <div>
            First render
        </div>
    )
}

export default page