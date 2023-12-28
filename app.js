document.addEventListener('DOMContentLoaded', function () {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const resultDiv = document.getElementById('result');

    // Fetch and populate currency options
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.rates);
            currencies.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.text = currency;
                const option2 = option1.cloneNode(true);
                fromCurrencySelect.appendChild(option1);
                toCurrencySelect.appendChild(option2);
            });
        })
        .catch(error => console.error('Error fetching currency data:', error));

    function convertCurrency() {
        const amount = amountInput.value;
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (!amount || isNaN(amount) || amount <= 0) {
            resultDiv.innerText = 'Please enter a valid amount.';
            return;
        }

        fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
            .then(response => response.json())
            .then(data => {
                const exchangeRate = data.rates[toCurrency];
                if (exchangeRate) {
                    const convertedAmount = (amount * exchangeRate).toFixed(2);
                    resultDiv.innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
                } else {
                    resultDiv.innerText = 'Invalid currency selection.';
                }
            })
            .catch(error => {
                console.error('Error converting currency:', error);
                resultDiv.innerText = 'Error converting currency. Please try again later.';
            });
    }

    function refreshRates() {
        // Refresh currency rates by fetching the latest data
        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(response => response.json())
            .then(data => console.log('Currency rates refreshed:', data))
            .catch(error => console.error('Error refreshing rates:', error));
    }
});
