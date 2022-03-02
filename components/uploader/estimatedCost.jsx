import CurrencyFormat from 'react-currency-format';

export default function EstimatedCost(props) {
    if (props.cost < .01) {
        return (
            <div>Estimated Cost: <strong>less than a penny</strong></div>
        )
    } else {
        return (
            <span>
                Cost:
                <CurrencyFormat value={props.cost} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'} renderText={value => <strong> {value}</strong>} />
            </span>
        )
    }
}