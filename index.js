class Widget{
    
    //main elements of widget
    #widgetContainer;
    #currencyInfoContainer;
    #currencyValueContainer;
    #title;
    #img;
    #tricker;
    #primaryValue;
    #secondaryValue;
    #rank;
    #mcapPrice;
    #volume;
    #currCurrency
    #trickerTrigger;
    #rankTrigger;
    #mcapPriceTrigger;
    #volumeTrigger;
    #currPrice
    #currMcapPrice
    #volumePrice
    
    constructor(currency, trickerTrigger, rankTrigger, mcapPriceTrigger, volumeTrigger, fiatCurrency, secondaryCurrency) {
        this.#currCurrency = currency;
        this.#trickerTrigger = trickerTrigger;
        this.#rankTrigger = rankTrigger;
        this.#mcapPriceTrigger = mcapPriceTrigger;
        this.#volumeTrigger = volumeTrigger;

        this.#widgetContainer = document.createElement("div");
        this.#currencyInfoContainer = document.createElement("div");
        this.#currencyValueContainer = document.createElement("div");

        this.#widgetContainer.className = "widget-container";
        this.#currencyInfoContainer.className = "currency-info-container";
        this.#currencyValueContainer.className = "currency-value-container";

        this.#generateWidget()

        this.#getData(fiatCurrency, secondaryCurrency)
    }

    async #getData(fiatCurrency, secondaryCurrency) {
        const uri = "https://api.coingecko.com/api/v3/coins/"+this.#currCurrency;
        const data = await fetch(uri).then((res) => res.json());
        this.#currPrice = data.market_data.current_price
        this.#currMcapPrice = data.market_data.market_cap
        this.#volumePrice = data.market_data.total_volume
        this.#title = data.name
        this.#img = data.image.large
        this.#tricker = data.tickers[0].base
        this.#rank = data.market_cap_rank;

        fiatCurrency.innerHTML=""
        secondaryCurrency.innerHTML=""
        for (let i in this.#currPrice) {
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

        this.#primaryValue = this.#currPrice[fiatCurrency.value].toLocaleString() + " " + fiatCurrency.value.toUpperCase();
        this.#secondaryValue = this.#currPrice[secondaryCurrency.value].toLocaleString() + " " + secondaryCurrency.value.toUpperCase();
        this.#mcapPrice = Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(this.#currMcapPrice[fiatCurrency.value]).toLocaleString() + " " + fiatCurrency.value.toUpperCase();
        
        this.#updateMcapVolumeCurrency(fiatCurrency, secondaryCurrency)

        this.#volume = Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(this.#volumePrice[volumeCurrency.value]).toLocaleString() + " " + volumeCurrency.value.toUpperCase();
        
        this.#updateWidget();
    }

    #generateCurrencyValueItem(title, value) {
        let node = document.createElement("div");
        let titleNode = document.createElement("span");
        let valueNode = document.createElement("span");

        node.className = "currency-value-item";
        titleNode.className = "currency-value-item-title";
        valueNode.className = "currency-value-item-value";
        
        node.id = title.toLowerCase().split(" ").join("");
        titleNode.id = title.toLowerCase().split(" ").join("")+"-title";
        valueNode.id = title.toLowerCase().split(" ").join("")+"-value";

        titleNode.textContent = title
        valueNode.textContent = value
        
        node.appendChild(titleNode)
        node.appendChild(valueNode)
        this.#currencyValueContainer.appendChild(node)
    }

    #generateCurrencyInfoConatinerChild() {
        let image = document.createElement("img");
        let currencyInfo = document.createElement("div");
        let currencyTitle = document.createElement("span");
        let currencyPrimaryValue = document.createElement("span");
        let currencySecondaryValue = document.createElement("span");
        
        currencyInfo.className = "currency-info";
        currencyTitle.className = "currency-title";
        currencyPrimaryValue.className = "currency-primary-value";
        currencySecondaryValue.className = "currency-secondary-value";
        
        image.id = "currency-img"
        currencyTitle.id = "currency-title";
        currencyPrimaryValue.id = "currency-primary-value";
        currencySecondaryValue.id = "currency-secondary-value";
        
        if (this.#img!==undefined) {
            image.src = this.#img;
        }
        currencyTitle.textContent = tickerTrigger ? this.#title + " (" + this.#tricker +")" : this.#title;
        currencyPrimaryValue.textContent = this.#primaryValue;
        currencySecondaryValue.textContent = this.#secondaryValue;
        
        currencyInfo.appendChild(currencyTitle)
        currencyInfo.appendChild(currencyPrimaryValue)
        currencyInfo.appendChild(currencySecondaryValue)
        
        this.#currencyInfoContainer.appendChild(image);
        this.#currencyInfoContainer.appendChild(currencyInfo);
    }

    #generateCurrencyValueContainerChild() {
        this.#generateCurrencyValueItem("Rank", this.#rank)
        this.#generateCurrencyValueItem("Market Price", this.#mcapPrice)
        this.#generateCurrencyValueItem("Volume", this.#volume)

    }
    
    #generateWidget() {
        this.#generateCurrencyInfoConatinerChild();
        this.#generateCurrencyValueContainerChild();

        this.#widgetContainer.appendChild(this.#currencyInfoContainer);
        this.#widgetContainer.appendChild(this.#currencyValueContainer);

        widgetPreviewContainer.appendChild(this.#widgetContainer);
    }

    #changeImg() {
        document.getElementById("currency-img").src = this.#img;
    }

    #changeTitle() {
        document.getElementById("currency-title").textContent = this.#trickerTrigger ? this.#title + " (" + this.#tricker +")" : this.#title;
    }
    
    #changePrimaryValue() {
        document.getElementById("currency-primary-value").textContent = this.#primaryValue
    }
    
    #changeSecondaryValue() {
        document.getElementById("currency-secondary-value").textContent = this.#secondaryValue
    }
    
    #changeRank() {
        document.getElementById("rank-value").textContent = this.#rank
    }
    
    #changeMarketPrice() {
        const node = document.getElementById("marketprice-value")
        if (node) {
            node.textContent = this.#mcapPrice
        }
        console.log(this.#mcapPrice)
    }
    
    #changeVolume() {
        const node = document.getElementById("volume-value");
        if (node) {
            node.textContent = this.#volume
        }
    }

    #handleRankToggle() {
        if (this.#rankTrigger) {
            document.getElementById("rank").style.display = "flex";
        } else {
            document.getElementById("rank").style.display = "none";
        }
    }

    #handleMarketPriceToogle() {
        if (this.#mcapPriceTrigger) {
            document.getElementById("marketprice").style.display = "flex";
        } else {
            document.getElementById("marketprice").style.display = "none";
        }
    }

    #handleVolumeToogle() {
        if (this.#volumeTrigger) {
            document.getElementById("volume").style.display = "flex";
        } else {
            document.getElementById("volume").style.display = "none";
        }
    }

    #updateMcapVolumeCurrency(fiatCurrency, secondaryCurrency) {
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

        this.#changeMarketPrice()
        this.#changeVolume()
    }
    
    #updateWidget() { 
        this.#changeImg();
        this.#changeTitle();
        this.#changePrimaryValue();
        this.#changeSecondaryValue();
        this.#changeRank();
        this.#changeMarketPrice();
        this.#changeVolume();

        this.#widgetContainer.dataset.name = this.#title
        this.#widgetContainer.dataset.rank = this.#rankTrigger
        this.#widgetContainer.dataset.marketPrice = this.#mcapPriceTrigger
        this.#widgetContainer.dataset.volume = this.#volumeTrigger
        this.#widgetContainer.dataset.ticker = this.#trickerTrigger
    }

    updateCurrCurrency(cryptocurrency, fiatCurrency, secondaryCurrency) {
        this.#currCurrency = cryptocurrency.value
        this.#getData(fiatCurrency, secondaryCurrency);
    }

    tickerToogle(tickerTrigger) {
        this.#trickerTrigger = tickerTrigger.checked
        this.#changeTitle();
    }

    rankToogle(rankTrigger) {
        this.#rankTrigger = rankTrigger.checked
        this.#handleRankToggle();
    }

    marketPriceToogle(marketCapTrigger) {
        this.#mcapPriceTrigger = marketCapTrigger.checked
        this.#handleMarketPriceToogle()
    }

    volumeToogle(volumeTrigger) {
        this.#volumeTrigger = volumeTrigger.checked
        this.#handleVolumeToogle();
    }

    updatePrimaryCurrency(fiatCurrency, secondaryCurrency, volumeCurrency) {
        this.#primaryValue = this.#currPrice[fiatCurrency.value].toLocaleString() + " " + fiatCurrency.value.toUpperCase();
        this.#changePrimaryValue()
        this.#updateMcapVolumeCurrency(fiatCurrency,secondaryCurrency)
        this.updateMarketPriceVolumeCurrency(volumeCurrency)
    }

    updateSecondaryCurrency(fiatCurrency, secondaryCurrency) { 
        this.#secondaryValue = this.#currPrice[secondaryCurrency.value].toLocaleString() + " " + secondaryCurrency.value.toUpperCase();
        this.#changeSecondaryValue();
        this.#updateMcapVolumeCurrency(fiatCurrency, secondaryCurrency)
    }

    updateMarketPriceVolumeCurrency(volumeCurrency) {
        this.#mcapPrice = Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(this.#currMcapPrice[volumeCurrency.value]).toLocaleString() + " " + volumeCurrency.value.toUpperCase();
        this.#volume = Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(this.#volumePrice[volumeCurrency.value]).toLocaleString() + " " + volumeCurrency.value.toUpperCase();
        this.#changeMarketPrice()
        this.#changeVolume()
    }
}

const cryptocurrency = document.getElementById("cryptocurrency");
const fiatCurrency = document.getElementById("fiat-currency");
const secondaryCurrency = document.getElementById("secondary-currency");
const volumeCurrency = document.getElementById("volume-currency");
const tickerTrigger = document.getElementById("primary-trigger");
const rankTrigger = document.getElementById("rank-trigger");
const marketCapTrigger = document.getElementById("market-cap-trigger");
const volumeTrigger = document.getElementById("volume-trigger");
const widgetPreviewContainer = document.getElementById("widget-preview-container");

const widget = new Widget(cryptocurrency.value, tickerTrigger.checked, rankTrigger.checked, marketCapTrigger.checked, volumeTrigger.checked, fiatCurrency, secondaryCurrency);

cryptocurrency.addEventListener("change", ()=>{widget.updateCurrCurrency(cryptocurrency, fiatCurrency, secondaryCurrency)})
fiatCurrency.addEventListener("change", ()=>{widget.updatePrimaryCurrency(fiatCurrency, secondaryCurrency, volumeCurrency)})
secondaryCurrency.addEventListener("change", (e)=>{widget.updateSecondaryCurrency(fiatCurrency, secondaryCurrency)})
volumeCurrency.addEventListener("change", (e)=>{widget.updateMarketPriceVolumeCurrency(volumeCurrency)})
tickerTrigger.addEventListener("change", ()=>{widget.tickerToogle(tickerTrigger)})
rankTrigger.addEventListener("change", (e)=>{widget.rankToogle(rankTrigger)})
marketCapTrigger.addEventListener("change", (e)=>{widget.marketPriceToogle(marketCapTrigger)})
volumeTrigger.addEventListener("change", (e)=>{widget.volumeToogle(volumeTrigger)})