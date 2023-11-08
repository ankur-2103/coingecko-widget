// class for generating widget
class Widget{

    //main elements of widget
    #widgetContainer;
    #currencyInfoContainer;
    #currencyValueContainer;

    //Widget constructor
    constructor() {
        this.#widgetContainer = document.createElement("div");
        this.#currencyInfoContainer = document.createElement("div");
        this.#currencyValueContainer = document.createElement("div");

        this.#widgetContainer.className = "widget-container";
        this.#currencyInfoContainer.className = "currency-info-container";
        this.#currencyValueContainer.className = "currency-value-container";
    }

    //clear current widget
    #clearWidget() {
        this.#widgetContainer.innerHTML = ""
        this.#currencyInfoContainer.innerHTML = ""
        this.#currencyValueContainer.innerHTML = ""
    }

    //generate currency value item
    #generateCurrencyValueItem(title, value) {
        let node = document.createElement("div");
        let titleNode = document.createElement("span");
        let valueNode = document.createElement("span");

        node.className = "currency-value-item";
        titleNode.className = "currency-value-item-title";
        valueNode.className = "currency-value-item-value";

        titleNode.textContent = title
        valueNode.textContent = value

        node.appendChild(titleNode)
        node.appendChild(valueNode)
        this.#currencyValueContainer.appendChild(node)
    }

    //generate childrens of currency info 
    #generateCurrencyInfoConatinerChild(name, img, ticker, tickerTrigger, primaryValue, secondaryValue) {
        let image = document.createElement("img");
        let currencyInfo = document.createElement("div");
        let currencyTitle = document.createElement("span");
        let currencyPrimaryValue = document.createElement("span");
        let currencySecondaryValue = document.createElement("span");
        
        currencyInfo.className = "currency-info";
        currencyTitle.className = "currency-title";
        currencyPrimaryValue.className = "currency-primary-value";
        currencySecondaryValue.className = "currency-secondary-value";
        
        image.src = img;
        currencyTitle.textContent = tickerTrigger ? name + " (" + ticker +")" : name;
        currencyPrimaryValue.textContent = primaryValue;
        currencySecondaryValue.textContent = secondaryValue;
        
        currencyInfo.appendChild(currencyTitle)
        currencyInfo.appendChild(currencyPrimaryValue)
        currencyInfo.appendChild(currencySecondaryValue)
        
        this.#currencyInfoContainer.appendChild(image);
        this.#currencyInfoContainer.appendChild(currencyInfo);
    }
    
    //generate childrens of currency value 
    #generateCurrencyValueContainerChild(rank, rankTrigger, mcapPrice, mcapTrigger, volume, volumeTrigger) {

        if (rankTrigger) {
            this.#generateCurrencyValueItem("Rank", rank)
        }
        
        if (mcapTrigger) {
            this.#generateCurrencyValueItem("Market Price", mcapPrice)
        }
        
        if (volumeTrigger) {
            this.#generateCurrencyValueItem("Volume", volume)
        }

        if (this.#currencyValueContainer.childNodes.length === 2) {
            this.#currencyValueContainer.childNodes[1].style.borderLeft = "gray 2px solid";
        } else if (this.#currencyValueContainer.childNodes.length === 3) {
            this.#currencyValueContainer.childNodes[1].style.borderLeft = "gray 2px solid";
            this.#currencyValueContainer.childNodes[1].style.borderRight = "gray 2px solid";
        }
    }

    //generate widget
    generateWidgetContainer(name, img, ticker, tickerTrigger, primaryValue, secondaryValue, rank, rankTrigger, mcap, mcapTrigger, volume, volumeTrigger) {
        this.#clearWidget()
        this.#generateCurrencyInfoConatinerChild(name, img, ticker, tickerTrigger, primaryValue, secondaryValue);
        this.#generateCurrencyValueContainerChild(rank, rankTrigger, mcap, mcapTrigger, volume, volumeTrigger);

        this.#widgetContainer.appendChild(this.#currencyInfoContainer);
        this.#widgetContainer.appendChild(this.#currencyValueContainer);

        this.#widgetContainer.dataset.name = name
        this.#widgetContainer.dataset.ticker = tickerTrigger;
        this.#widgetContainer.dataset.rank = rankTrigger;
        this.#widgetContainer.dataset.mcap = mcapTrigger;
        this.#widgetContainer.dataset.volume = volumeTrigger;

        return this.#widgetContainer;
    }
}

//Access document elements
const cryptocurrency = document.getElementById("cryptocurrency");
const fiatCurrency = document.getElementById("fiat-currency");
const secondaryCurrency = document.getElementById("secondary-currency");
const volumeCurrency = document.getElementById("volume-currency");
const primaryTrigger = document.getElementById("primary-trigger");
const rankTrigger = document.getElementById("rank-trigger");
const marketCapTrigger = document.getElementById("market-cap-trigger");
const volumeTrigger = document.getElementById("volume-trigger");
const widgetPreviewContainer = document.getElementById("widget-preview-container");

//Add onChangeListner
const widget = new Widget();
cryptocurrency.addEventListener("change", (e)=>{getWidgetData()})
fiatCurrency.addEventListener("change", (e)=>{updateVolumeCurrency()})
secondaryCurrency.addEventListener("change", (e)=>{updateVolumeCurrency()})
volumeCurrency.addEventListener("change", (e)=>{updateWidget()})
primaryTrigger.addEventListener("change", (e)=>{updateWidget()})
rankTrigger.addEventListener("change", (e)=>{updateWidget()})
marketCapTrigger.addEventListener("change", (e)=>{updateWidget()})
volumeTrigger.addEventListener("change", (e)=>{updateWidget()})

//Store data
let title, img, ticker, mcapRank, currPrice, mcapPrice, volumePrice;

// Get Widget Data
const getWidgetData = async () => {
    const uri = "https://api.coingecko.com/api/v3/coins/"+cryptocurrency.value;
    const data = await fetch(uri).then((res) => res.json());
    title = data.name
    img = data.image.large
    ticker = data.tickers[0].base
    mcapRank = data.market_cap_rank;
    currPrice = data.market_data.current_price
    mcapPrice = data.market_data.market_cap
    volumePrice = data.market_data.total_volume
    fiatCurrency.innerHTML=""
    secondaryCurrency.innerHTML=""
    for (let i in currPrice) {
        let fiatOption = document.createElement("option");
        let secondaryOption = document.createElement("option");

        fiatOption.value = i
        secondaryOption.value = i

        fiatOption.text = i.toUpperCase()
        secondaryOption.text = i.toUpperCase()

        if (i === "inr") fiatOption.selected = true
        if (i === "usd") secondaryOption.selected = true
        
        fiatCurrency.appendChild(fiatOption)
        secondaryCurrency.appendChild(secondaryOption)
    }
    updateVolumeCurrency();
    updateWidget();
}

//Update volume currency 
const updateVolumeCurrency = async () => {
    let option1 = document.createElement("option");
    let option2 = document.createElement("option");

    option1.value = fiatCurrency.value;
    option2.value = secondaryCurrency.value;

    option1.text = fiatCurrency.value.toUpperCase();
    option2.text = secondaryCurrency.value.toUpperCase();

    volumeCurrency.innerHTML = ""

    if (fiatCurrency.value === secondaryCurrency.value) {
        volumeCurrency.appendChild(option1);
    } else {
        volumeCurrency.appendChild(option1);
        if(option2.value !== "none")volumeCurrency.appendChild(option2);
    }

    updateWidget()
}

//Update widget
const updateWidget = () => {
    const primaryValue = currPrice[fiatCurrency.value].toLocaleString() + " "+ fiatCurrency.value.toUpperCase()
    const secondaryValue = currPrice[secondaryCurrency.value].toLocaleString() + " " + secondaryCurrency.value.toUpperCase()
    const mcapValue = Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(mcapPrice[fiatCurrency.value]).toLocaleString() + " " +fiatCurrency.value.toUpperCase()
    const volumeValue = Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(volumePrice[volumeCurrency.value]).toLocaleString() + " " +volumeCurrency.value.toUpperCase()
    const newWidgetContainer = widget.generateWidgetContainer(title, img, ticker, primaryTrigger.checked, primaryValue, secondaryValue, mcapRank, rankTrigger.checked, mcapValue, marketCapTrigger.checked, volumeValue, volumeTrigger.checked);
    widgetPreviewContainer.innerHTML = "";
    widgetPreviewContainer.appendChild(newWidgetContainer);
}

getWidgetData();