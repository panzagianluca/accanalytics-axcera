import type { Column, DataItem } from "./types"

export const initialColumns: Column<DataItem>[] = [
  { id: "account", header: "Account", accessor: "account", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "orderNr", header: "Order Nr", accessor: "orderNr", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "customer", header: "Customer", accessor: "customer", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "name", header: "Name", accessor: "name", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "program", header: "Program", accessor: "program", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "platform", header: "Platform", accessor: "platform", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "platformStatus", header: "Platform Status", accessor: "platformStatus", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "email", header: "Email", accessor: "email", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "country", header: "Country", accessor: "country", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "type", header: "Type", accessor: "type", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "serverGroup", header: "Server Group", accessor: "serverGroup", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "balance", header: "Balance", accessor: "balance", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "equity", header: "Equity", accessor: "equity", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "growth", header: "Growth", accessor: "growth", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "pnl", header: "PnL", accessor: "pnl", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "level", header: "Level", accessor: "level", isDraggable: true, isRemovable: true, isVisible: true },
  { id: "softBreaches", header: "Soft Breaches", accessor: "softBreaches", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "copyTrading", header: "Copy Trading", accessor: "copyTrading", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "hedgeTrading", header: "Hedge Trading", accessor: "hedgeTrading", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "ipCount", header: "IP Count", accessor: "ipCount", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "avgLoss", header: "Avg. Loss", accessor: "avgLoss", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "avgWin", header: "Avg. Win", accessor: "avgWin", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "dailyStopOutBar", header: "Daily Stop out bar", accessor: "dailyStopOutBar", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "overallStopOutBar", header: "Overall Stop out bar", accessor: "overallStopOutBar", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "maxWithdrawal", header: "Max Withdrawal", accessor: "maxWithdrawal", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "targetEquityBar", header: "Target Equity Bar", accessor: "targetEquityBar", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "hwmBalance", header: "HWM Balance", accessor: "hwmBalance", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "daysSinceDeposit", header: "Days Since Deposit", accessor: "daysSinceDeposit", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "activeTradingDays", header: "Active Trading Days", accessor: "activeTradingDays", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "inactiveTradingDays", header: "Inactive Trading Days", accessor: "inactiveTradingDays", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "firstTradeDate", header: "First Trade Date", accessor: "firstTradeDate", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "daysSinceFirstTrade", header: "Days Since First Trade", accessor: "daysSinceFirstTrade", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "lwmAllTrades", header: "LWM All Trades", accessor: "lwmAllTrades", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "consistencyBestWorstDay", header: "Consistency: Best & Worst Day Profit", accessor: "consistencyBestWorstDay", isDraggable: true, isRemovable: true, isVisible: false },
  { id: "consistencyTopDay", header: "Consistency: Top Day Profit", accessor: "consistencyTopDay", isDraggable: true, isRemovable: true, isVisible: false },
]

// For now, allAvailableColumns is the same as initialColumns.
// If you want to add more columns that are not initially visible but can be added,
// you would add them here with isVisible: false.
export const allAvailableColumns: Column<DataItem>[] = [...initialColumns]

// Function to parse CSV data from the Account Analytics file
function parseCSVData(): DataItem[] {
  // CSV raw data as string
  const csvRawData = `"9466","548","C10002","Madhav Jadhav","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","madhav@axcera.io","Cayman Islands","evaluation","Axcera PropTech v2","9837.28","9837.28","-1.63","-101.63","0","0","false","false","8","-59.77","0","0","0","0.00","17000","","276","0","139","07/10/2024 07:13:22","276","9837.28","","0"
"100021954128","228","C10002","Madhav Jadhav","DX Challenge $10K, - Evaluation","DXTrade","READ ONLY","madhav@axcera.io","Cayman Islands","evaluation","","10100","10100","1","-99.00","0","0","false","false","8","0","0","0","0","85.00","11000","","276","0","1","","0","10000","","100"
"706803","660","C10002","Madhav Jadhav","Trade L Challenge $10K, - Evaluation","TradeLocker","ENABLED","madhav@axcera.io","Cayman Islands","evaluation","621505","10000","10000","0","-100.00","0","0","false","false","8","0","0","0","0","0.00","11000","","276","0","274","","0","10000","","100"
"9481","648","C10002","Madhav Jadhav","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","madhav@axcera.io","Cayman Islands","evaluation","","9991.84","9991.84","-0.08","-100.08","0","0","false","false","8","-0.23","5.63","4995.92","2000","0.00","11000","","275","0","58","08/10/2024 06:11:33","275","9991.84","","0"
"9483","650","C10002","Madhav Jadhav","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","madhav@axcera.io","Cayman Islands","evaluation","Axcera PropTech v2","10000","10000","0","-100.00","0","0","false","false","8","0","0","0","0","0.00","11000","","275","0","273","","0","10000","","100"
"9484","","C10002","Madhav Jadhav","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","madhav@axcera.io","Cayman Islands","evaluation","","9995.94","9995.94","-0.04","-100.04","0","0","false","false","8","-0.82","0.03","5000","5000","0.00","15000","","275","0","273","08/10/2024 07:12:07","275","9995.94","","100"
"9485","","C10084","Comp cust 1 Comp cust 1","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","madhav+competition@axcera.io","India","evaluation","Axcera PropTech v2","9996.24","9996.24","-0.04","-100.04","0","0","false","false","1","-1.81","1.74","0","0","0.00","11000","","275","0","172","08/10/2024 07:20:51","275","9996.24","","100"
"9489","","C10010","Herman AXC 123","AXC Competitions MTR $25K","MatchTrader","ENABLED","herman@axcera.io","United Kingdom","evaluation","Axcera PropTech v2","25000","25000","0","-100.00","0","0","false","false","2","0","0","23750","22500","0.00","0","","275","0","273","","0","25000","","100"
"706866","","C10010","Herman AXC 123","AXC Competitions TL $25K","TradeLocker","ENABLED","herman@axcera.io","United Kingdom","evaluation","621505","25000","25000","0","-100.00","0","0","false","false","2","0","0","23750","22500","0.00","0","","275","0","273","","0","25000","","100"
"9499","","C10002","Madhav Jadhav","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","madhav@axcera.io","Cayman Islands","evaluation","Axcera PropTech v2","10000","10000","0","-100.00","0","0","false","false","8","0","0","0","0","0.00","11000","","275","0","273","","0","10000","","100"
"706882","","C10087","Herman Shaho","AXC Competitions TL $25K","TradeLocker","ENABLED","herman+2@axcera.io","Sweden","evaluation","621505","25067.55","25067.55","0.27","-99.73","0","0","false","false","2","-57.75","102.92","23814.1725","22567.55","0.00","0","","275","0","270","09/10/2024 11:27:05","274","25000","","100"
"9503","","C10005","Ramis Ayoub","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","ramis@axcera.io","Pakistan","evaluation","Axcera PropTech v2","10000","10000","0","-100.00","0","0","false","false","3","0","0","0","0","0.00","11000","","275","0","273","","0","10000","","100"
"9504","","C10007","Afaque  Ahmed","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","afaque@axcera.io","Oman","evaluation","","10767.56","10767.56","7.68","-92.32","0","0","false","false","3","-0.26","901.87","9767.56","9767.56","767.56","0","","275","0","270","10/10/2024 09:20:44","273","10000","","100"
"9511","","C10091","Richard T","AXC Competitions MTR $25K","MatchTrader","ENABLED","richard@axcera.io","Spain","evaluation","Axcera PropTech v2","25000","25000","0","-100.00","0","0","false","false","1","0","0","23750","22500","0.00","0","","275","0","273","","0","25000","","100"
"706944","","C10095","Kaho Chan","AXC Competitions TL $25K","TradeLocker","ENABLED","kaho@axcera.io","Cyprus","evaluation","621505","25000","25000","0","-100.00","0","0","false","false","3","0","0","23750","22500","0.00","0","","273","0","271","","0","25000","","100"
"9522","","C10002","Madhav Jadhav","MatchT Challenge $10K, - Evaluation - Contract","MatchTrader","ENABLED","madhav@axcera.io","Cayman Islands","evaluation","Axcera PropTech v2","10000","10000","0","-100.00","0","0","false","false","8","0","0","0","0","0.00","11000","","273","0","271","","0","10000","","100"
"706987","160004","C10004","NISHANT RANGARI","Trade L Challenge $10K, - Evaluation","TradeLocker","ENABLED","nishant@axcera.io","Honduras","evaluation","621505","10000","10000","0","-100.00","0","0","false","false","15","0","0","0","0","0.00","0","","272","0","271","","0","10000","","100"
"9534","556","C10104","BrevoEmailTest BrevoEmailTestLname","MatchT Challenge $10K, - Evaluation","MatchTrader","DISABLED","madhav+brevo@axcera.io","India","evaluation","Axcera PropTech v2","10000","10000","0","-100.00","0","0","false","false","2","0","0","0","0","0.00","11000","","272","0","271","","0","10000","","100"
"706988","","C10104","BrevoEmailTest BrevoEmailTestLname","Trade L Challenge $10K, - Evaluation","TradeLocker","ENABLED","madhav+brevo@axcera.io","India","evaluation","621505","10000","10000","0","-100.00","0","0","false","false","2","0","0","0","0","0.00","11000","","272","0","271","","0","10000","","100"
"9538","","C10104","BrevoEmailTest BrevoEmailTestLname","MatchT Challenge $10K, - Evaluation - Contract","MatchTrader","ENABLED","madhav+brevo@axcera.io","India","evaluation","Axcera PropTech v2","10000","10000","0","-100.00","0","0","false","false","2","0","0","0","0","0.00","11000","","272","0","271","","0","10000","","100"
"707004","","C10009","Dev Dev","AXC Competitions TL $25K","TradeLocker","ENABLED","anwaar@axcera.io","United Kingdom","evaluation","621505","25000","25000","0","-100.00","0","0","false","false","1","0","0","23750","22500","0.00","0","","271","0","271","","0","25000","","100"
"707005","","C10087","Herman Shaho","AXC Competitions TL $25K","TradeLocker","ENABLED","herman+2@axcera.io","Sweden","evaluation","621505","25000","25000","0","-100.00","0","0","false","false","2","0","0","23750","22500","0.00","0","","271","0","271","","0","25000","","100"
"9544","","C10101","Victor Affiliate 777","AXC Competitions MTR $25K","MatchTrader","ENABLED","victor+777@axcera.io","American Samoa","evaluation","","25000","25000","0","-100.00","0","0","false","false","2","0","0","23750","22500","0.00","275000","","269","0","268","","0","25000","","100"
"707369","","C10090","Derrick AXC","Trade L Challenge $10K, - Evaluation","TradeLocker","ENABLED","derrick@axcera.io","Sweden","evaluation","","10332.5","10332.5","3.33","-96.67","0","0","false","false","5","-31.75","48","0","0","332.50","11000","","268","0","174","17/01/2025 06:04:13","174","10000","","90.23"
"9570","","C10105","EmailLanguageTest_3 BrevoEmailTestLname_3","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","madhav+65@axcera.io","India","evaluation","Axcera PropTech v2","10000","10000","0","-100.00","0","0","false","false","0","0","0","0","0","0.00","11000","","268","0","267","","0","10000","","100"
"707404","","C10057","QA regression regression test","Trade L Challenge $10K, - Evaluation","TradeLocker","ENABLED","madhav+5@axcera.io","United Kingdom","evaluation","621505","10002","10002","0.02","-99.98","0","0","false","false","2","-1.33","3","0","0","2.00","11000","","267","0","256","16/10/2024 03:01:45","267","10000","","100"
"9603","285","C10114","Madhav_reg Jadhav_reg","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","madhav+reg2@axcera.io","India","evaluation","Axcera PropTech v2","10000","10000","0","-100.00","0","0","false","false","1","0","0","0","0","0.00","11000","","267","0","266","","0","10000","","100"
"101161316431","","C10116","QA 511","DX Challenge $10K, - Evaluation","DXTrade","ENABLED","victor+511@axcera.io","India","evaluation","","10000","10000","0","-100.00","0","0","false","false","1","0","0","0","0","0.00","11000","","266","0","265","","0","10000","","100"
"9614","","C10004","NISHANT RANGARI","MatchT KYC Plan","MatchTrader","ENABLED","nishant@axcera.io","Honduras","evaluation","Axcera PropTech v2","10000","10000","0","-100.00","0","0","false","false","15","0","0","0","0","0.00","11000","","266","0","265","","0","10000","","100"
"101221559812","160003","C10122","Trader Area QA Testing","DX Challenge $10K, - Evaluation","DXTrade","ENABLED","madhav+traderarea@axcera.io","Heard Island and Mcdonald Islands","evaluation","","10290","10290","2.9","-97.10","0","0","false","false","3","0","0","6174","4000","290.00","13000","","265","0","263","","0","10000","","100"
"9641","160002","C10122","Trader Area QA Testing","MatchT Challenge $10K, - Evaluation","MatchTrader","ENABLED","madhav+traderarea@axcera.io","Heard Island and Mcdonald Islands","evaluation","","10040","10040","0.4","-99.60","0","0","false","false","3","0","0","7028","4040","40.00","12500","","265","0","264","","0","10000","","100"
"100911293847","","C10091","Richard T","DX Challenge $10K, - Evaluation","DXTrade","ENABLED","richard@axcera.io","Spain","evaluation","","9999.99","8401.75","0","-115.98","0","0","false","false","1","0","0","0","0","0.00","11000","","262","0","0","20/10/2024 22:57:47","262","8379.47","","0"
"101212644228","","C10121","Trader Area Test Account 2 ","DX Challenge $10K - Funded","DXTrade","ENABLED","victor+1111@axcera.io","India","funded","","10000","10000","0","-100.00","0","0","false","false","3","0","0","0","0","0.00","11000","","262","0","262","","0","10000","","100"`;

  // Function to parse CSV line respecting quoted values
  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] === ',')) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
        i++;
        continue;
      } else if (char !== '"' || inQuotes) {
        current += char;
      }
      i++;
    }
    
    result.push(current);
    return result;
  }

  // Parse CSV data
  const lines = csvRawData.trim().split('\n');
  const csvData: DataItem[] = [];
  
  lines.forEach((line, index) => {
    if (line.trim()) {
      const fields = parseCSVLine(line);
      if (fields.length >= 35) {
        csvData.push({
          id: (index + 1).toString(),
          account: fields[0] || '',
          orderNr: fields[1] || '',
          customer: fields[2] || '',
          name: fields[3] || '',
          program: fields[4] || '',
          platform: fields[5] || '',
          platformStatus: fields[6] || '',
          email: fields[7] || '',
          country: fields[8] || '',
          type: fields[9] || '',
          serverGroup: fields[10] || '',
          balance: fields[11] || '',
          equity: fields[12] || '',
          growth: fields[13] || '',
          pnl: fields[14] || '',
          level: fields[15] || '',
          softBreaches: fields[16] || '',
          copyTrading: fields[17] || '',
          hedgeTrading: fields[18] || '',
          ipCount: fields[19] || '',
          avgLoss: fields[20] || '',
          avgWin: fields[21] || '',
          dailyStopOutBar: fields[22] || '',
          overallStopOutBar: fields[23] || '',
          maxWithdrawal: fields[24] || '',
          targetEquityBar: fields[25] || '',
          hwmBalance: fields[26] || '',
          daysSinceDeposit: fields[27] || '',
          activeTradingDays: fields[28] || '',
          inactiveTradingDays: fields[29] || '',
          firstTradeDate: fields[30] || '',
          daysSinceFirstTrade: fields[31] || '',
          lwmAllTrades: fields[32] || '',
          consistencyBestWorstDay: fields[33] || '',
          consistencyTopDay: fields[34] || ''
        });
      }
    }
  });

  return csvData;
}

// Generate data from CSV - duplicated for more rows
export const mockData: DataItem[] = (() => {
  const originalData = parseCSVData();
  const duplicatedData = originalData.map((item, index) => ({
    ...item,
    id: (originalData.length + index + 1).toString(),
    account: item.account + "_DUP", // Make accounts unique
  }));
  
  // Combine original and duplicated data
  return [...originalData, ...duplicatedData];
})();
