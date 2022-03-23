import CurrencyFormat from 'react-currency-format';

export default function EstimatedCost({ costInCents, minimumWarning=false }) {
    return (
        <div>
            {costInCents < 0 && (
                <div className='pt-3 font-bold'>Free!</div>
            )}
            {costInCents > 0 && costInCents < 1 && (
                <div>Estimated Cost: <strong>less than a penny</strong></div>
            )}
            {costInCents > 1 && (
                <div>
                    Cost:
                    <CurrencyFormat 
                        value={costInCents / 100} 
                        displayType={'text'} 
                        decimalScale={2} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        renderText={value => <strong> {value}</strong>} 
                    />
                </div>
            )}
            {minimumWarning && costInCents > 0 && costInCents < 5 && (
                <div>
                    Minimum $5 charge which can be applied across uploads.
                </div>
            )}
        </div>
    )
}