import { useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { PRICE_MINIMUM_IN_CENTS } from '../../lib/constants';
import CostDetailModal from './CostDetailModal';

type EstimatedCostProps = {
    costInCents: number,
}

export default function EstimatedCost({ costInCents }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            {costInCents < 0 && (
                <div className='pt-3 font-bold'>Free!</div>
            )}
            {costInCents > 0 && costInCents < 1 && (
                <div>Estimated Cost: <strong>less than a penny</strong></div>
            )}
            {costInCents > 1 && (
                <span>
                    Cost:
                    <CurrencyFormat
                        value={costInCents / 100}
                        displayType={'text'}
                        decimalScale={2}
                        thousandSeparator={true}
                        prefix={'$'}
                        renderText={value => <strong> {value}</strong>}
                    />
                    <svg
                        onClick={() => setIsModalOpen(true)}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline align-top cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
            )}
            <CostDetailModal
                open={isModalOpen}
                setOpen={setIsModalOpen}
            />
        </div>
    )
}