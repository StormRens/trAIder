import {useState, useEffect } from 'react';

function StockTicker({userWatchList = null}) {
    //Here are our temp stocks that we are watching
    //Once we have the database working/connected than we will connect this to that.
    const defaultStocks = [
        {symbol: 'AAPL', price: 178.52, change: 2.34, changePercent: 1.33, trend: [170, 172, 175, 173, 178] },
        { symbol: 'MSFT', price: 412.80, change: -3.21, changePercent: -0.77, trend: [415, 413, 410, 414, 413] },
        { symbol: 'GOOGL', price: 142.65, change: 1.87, changePercent: 1.32, trend: [140, 141, 139, 142, 143] },
        { symbol: 'AMZN', price: 178.25, change: 4.52, changePercent: 2.60, trend: [173, 175, 176, 177, 178] },
        { symbol: 'TSLA', price: 248.50, change: -5.30, changePercent: -2.09, trend: [253, 251, 249, 250, 248] },
        { symbol: 'NVDA', price: 875.28, change: 12.45, changePercent: 1.44, trend: [860, 865, 870, 872, 875] }
    ];

    //Either we are going to use the default stocks, or if the user is signed in then we can use the user watch list.
    //we use the default if they arent logged in or user isnt watching any stocks.
    const [stocks, setStocks] = useState(userWatchList || defaultStocks); 
    
    // TODO: This useEffect will fetch real-time data for the user's selected stocks
    useEffect(() => {
        // Future implementation:
        // 1. Get user's watchlist symbols from database
        // 2. Fetch real-time stock data for those symbols from stock API
        // 3. Update the stocks state
        
        // Example structure:
        // const fetchUserStocks = async () => {
        //     const watchlistSymbols = await getUserWatchlist(userId);
        //     const stockData = await fetchStockData(watchlistSymbols);
        //     setStocks(stockData);
        // };
        // fetchUserStocks();
        
    }, [userWatchList]);

    // Render a mini sparkline chart using SVG
    const renderSparkline = (trend, isPositive) => {
        const width = 60;
        const height = 30;
        const max = Math.max(...trend);
        const min = Math.min(...trend);
        const range = max - min || 1;

        // Generate path points
        const points = trend.map((value, index) => {
            const x = (index / (trend.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="sparkline">
                <polyline
                    points={points}
                    fill="none"
                    stroke={isPositive ? '#10b981' : '#ef4444'}
                    strokeWidth="2"
                />
            </svg>
        );
    };

    return (
        <div className="stock-ticker-container">
            <div className="stock-ticker-scroll">
                {/* Render stocks twice for infinite scroll effect */}
                {[...stocks, ...stocks].map((stock, index) => {
                    const isPositive = stock.change >= 0;
                    return (
                        <div key={index} className="stock-ticker-item">
                            {/* Stock symbol */}
                            <div className="ticker-symbol">{stock.symbol}</div>
                            
                            {/* Price and change */}
                            <div className="ticker-info">
                                <div className="ticker-price">${stock.price.toFixed(2)}</div>
                                <div className={`ticker-change ${isPositive ? 'positive' : 'negative'}`}>
                                    {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                                </div>
                            </div>
                            
                            {/* Mini chart */}
                            <div className="ticker-chart">
                                {renderSparkline(stock.trend, isPositive)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


export default StockTicker; 