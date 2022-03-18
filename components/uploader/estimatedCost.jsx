import CurrencyFormat from 'react-currency-format';

export default function EstimatedCost(props) {
    return (
        <div>
            {props.cost < .01 ? (
                <div>Estimated Cost: <strong>less than a penny</strong></div>
            ) : (
                <div>
                    Cost:
                    <CurrencyFormat 
                        value={props.cost} 
                        displayType={'text'} 
                        decimalScale={2} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        renderText={value => <strong> {value}</strong>} 
                    />
                </div>
            )}
            {props.cost < 5 && (
                <div>
                    Minimum $5 charge which can be applied across uploads.
                </div>
            )}
        </div>
    )
}