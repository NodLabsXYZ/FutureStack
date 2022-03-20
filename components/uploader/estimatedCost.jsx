import CurrencyFormat from 'react-currency-format';

export default function EstimatedCost({ cost, minimumWarning=false }) {
    return (
        <div>
            {cost < 0 && (
                <div className='pt-3 font-bold'>Free!</div>
            )}
            {cost > 0 && cost < .01 && (
                <div>Estimated Cost: <strong>less than a penny</strong></div>
            )}
            {cost > .01 && (
                <div>
                    Cost:
                    <CurrencyFormat 
                        value={cost} 
                        displayType={'text'} 
                        decimalScale={2} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        renderText={value => <strong> {value}</strong>} 
                    />
                </div>
            )}
            {minimumWarning && cost > 0 && cost < 5 && (
                <div>
                    Minimum $5 charge which can be applied across uploads.
                </div>
            )}
        </div>
    )
}