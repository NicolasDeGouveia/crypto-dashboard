'use client'

import Image from 'next/image'

type Props = {
    id: string
    name: string
    price: number
    percent: number
}

const Card = ({id, name, price, percent}: Props) => {
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <Image
                        src={`/coins/${id}.svg`}
                        alt={name}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <p className="text-sm text-slate-500 capitalize">{name}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                            ${price}
                        </p>
                    </div>
                </div>

                <span className={`rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium ${percent >= 0 ? " bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"} `}>
                    {percent.toFixed(2)}%
                </span>

            </div>
        </div>
    )
}

export default Card
