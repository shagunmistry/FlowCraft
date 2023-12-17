export const chartJsBasicPrimitveCode = JSON.stringify({
  datasets: [
    {
      data: [20, 10],
    },
  ],
  labels: ['a', 'b'],
})

export const chartJsObjectCodeForLineType = JSON.stringify({
  datasets: [
    {
      data: [
        { x: 10, y: 20 },
        { x: 15, y: null },
        { x: 20, y: 10 },
      ],
    },
  ],
})

export const chartJsObjectCodeForLineType2 = JSON.stringify({
  datasets: [
    {
      data: [
        { x: '2016-12-25', y: 20 },
        { x: '2016-12-26', y: 10 },
      ],
    },
  ],
})

export const chartJsObjectCodeForLineType3 = JSON.stringify({
  datasets: [
    {
      data: {
        January: 10,
        February: 20,
      },
    },
  ],
})

export const chartJsObjectCodeForBarType = JSON.stringify({
  datasets: [
    {
      data: [
        { x: 'Sales', y: 20 },
        { x: 'Revenue', y: 10 },
      ],
    },
  ],
})

export const chartJsObjectCodeForBarType2 = JSON.stringify({
  labels: ['Jan', 'Feb'],
  datasets: [
    {
      label: 'Net sales',
      data: [
        { x: 'Jan', net: 100, cogs: 50, gm: 50 },
        { x: 'Feb', net: 120, cogs: 55, gm: 75 },
      ],
      parsing: {
        yAxisKey: 'net',
      },
    },
    {
      label: 'Cost of goods sold',
      data: [
        { x: 'Jan', net: 100, cogs: 50, gm: 50 },
        { x: 'Feb', net: 120, cogs: 55, gm: 75 },
      ],
      parsing: {
        yAxisKey: 'cogs',
      },
    },
    {
      label: 'Gross margin',
      data: [
        { x: 'Jan', net: 100, cogs: 50, gm: 50 },
        { x: 'Feb', net: 120, cogs: 55, gm: 75 },
      ],
      parsing: {
        yAxisKey: 'gm',
      },
    },
  ],
})

export const chartJsAllCombinedBasicCode = `
Example One:
\`\`\`JSON
${chartJsBasicPrimitveCode}
\`\`\`

Example Two:
\`\`\`JSON
${chartJsObjectCodeForLineType}
\`\`\`

Example Three:
\`\`\`JSON
${chartJsObjectCodeForLineType2}
\`\`\

Example Four:
\`\`\`JSON
${chartJsObjectCodeForLineType3}
\`\`\

Example Five:
\`\`\`JSON
${chartJsObjectCodeForBarType}
\`\`\

Example Six:
\`\`\`JSON
${chartJsObjectCodeForBarType2}
\`\`\

`

export const chartJsNetflixFinancialExampleReport = `
Netflix, Inc.									
Streaming Revenue and Membership Information by Region									
(unaudited)									
(in thousands, except for average revenue per membership and percentages)									
						As of / Three Months Ended			
						March 31,	June 30,	September 30,	December 31,
						2021	2021	2021	2021
									
United States and Canada (UCAN)									
	Revenues (1)					 $3,170,972 	 $3,234,643 	 $3,257,697 	 $3,308,788 
	Paid net membership additions (losses)					 448 	 (433)	 73 	 1,191 
	Paid memberships at end of period					 74,384 	 73,951 	 74,024 	 75,215 
	Average paying memberships					 74,160 	 74,168 	 73,988 	 74,620 
	Average revenue per membership (2)					$14.25 	$14.54 	$14.68 	$14.78 
	% change as compared to prior-year period					9%	10%	10%	9%
	Constant currency % change as compared to prior-year period*					9%	9%	9%	9%
									
Europe, Middle East and Africa (EMEA)									
	Revenues					 $2,343,674 	 $2,400,480 	 $2,432,239 	 $2,523,426 
	Paid net membership additions (losses)					 1,810 	 188 	 1,804 	 3,536 
	Paid memberships at end of period					 68,508 	 68,696 	 70,500 	 74,036 
	Average paying memberships					 67,603 	 68,602 	 69,598 	 72,268 
	Average revenue per membership (2)					$11.56 	$11.66 	$11.65 	$11.64 
	% change as compared to prior-year period					11%	11%	7%	5%
	Constant currency % change as compared to prior-year period*					4%	2%	3%	6%
									
Latin America (LATAM)									
	Revenues					 $836,647 	 $860,882 	 $915,297 	 $964,150 
	Paid net membership additions (losses)					 357 	 764 	 330 	 973 
	Paid memberships at end of period					 37,894 	 38,658 	 38,988 	 39,961 
	Average paying memberships					 37,716 	 38,276 	 38,823 	 39,475 
	Average revenue per membership (2)					$7.39 	$7.50 	$7.86 	$8.14 
	% change as compared to prior-year period					-8%	1%	8%	14%
	Constant currency % change as compared to prior-year period*					5%	2%	8%	17%
									
Asia-Pacific (APAC)									
	Revenues					 $762,414 	 $799,480 	 $834,002 	 $870,705 
	Paid net membership additions					 1,361 	 1,022 	 2,176 	 2,581 
	Paid memberships at end of period					 26,853 	 27,875 	 30,051 	 32,632 
	Average paying memberships					 26,173 	 27,364 	 28,963 	 31,342 
	Average revenue per membership (2)					$9.71 	$9.74 	$9.60 	$9.26 
	% change as compared to prior-year period					9%	9%	4%	-1%
	Constant currency % change as compared to prior-year period*					3%	1%	2%	2%`

export const chartJsTeslaStockPricesExampleReport = `Financial Highlights
Fiscal Year
Fiscal Year Ends 	Dec 31, 2022
Most Recent Quarter (mrq)	Sep 29, 2023
Profitability
Profit Margin 	11.21%
Operating Margin (ttm)	7.55%
Management Effectiveness
Return on Assets (ttm)	7.96%
Return on Equity (ttm)	22.46%
Income Statement
Revenue (ttm)	95.92B
Revenue Per Share (ttm)	30.28
Quarterly Revenue Growth (yoy)	8.80%
Gross Profit (ttm)	20.85B
EBITDA 	15.15B
Net Income Avi to Common (ttm)	10.79B
Diluted EPS (ttm)	3.10
Quarterly Earnings Growth (yoy)	-43.70%
Balance Sheet
Total Cash (mrq)	26.08B
Total Cash Per Share (mrq)	8.2
Total Debt (mrq)	8.19B
Total Debt/Equity (mrq)	15.02%
Current Ratio (mrq)	1.69
Book Value Per Share (mrq)	16.82
Cash Flow Statement
Operating Cash Flow (ttm)	12.16B
Levered Free Cash Flow (ttm)	1.61B`

export const chartJsCancerRatesExampleReport = `Year	Case Count	Population
1999	1,304,480	275,461,348
2000	1,332,169	278,558,214
2001	1,377,099	282,115,961
2002	1,394,227	284,766,512
2003	1,407,981	290,107,933
2004	1,430,915	292,805,298
2005	1,459,835	295,516,599
2006	1,495,970	298,379,912
2007	1,541,961	301,231,207
2008	1,562,587	304,093,966
2009	1,581,111	306,771,529
2010	1,577,485	309,327,143
2011	1,613,893	311,583,481
2012	1,603,836	313,877,662
2013	1,636,789	316,059,947
2014	1,663,263	318,386,329
2015	1,705,334	320,738,994
2016	1,730,525	323,071,755
2017	1,760,488	325,122,128
2018	1,780,222	326,838,199
2019	1,818,739	328,329,953
2020	1,603,844	319,590,911`

export const chartJsAverageNewYorkWeatherReport = `YEAR JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC ANNUAL
2008 36.5 35.8 42.6 54.9 60.1 74.0 78.4 73.8 68.8 55.1 45.8 38.1 55.3
2009 27.9 36.7 42.4 54.5 62.5 67.5 72.7 75.7 66.3 55.0 51.2 35.9 54.0
2010 32.5 33.1 48.2 57.9 65.3 74.7 81.3 77.4 71.1 58.1 47.9 32.8 56.7
2011 29.7 36.0 42.3 54.3 64.5 72.3 80.2 75.3 70.0 57.1 51.9 43.3 56.4
2012 37.3 40.9 50.9 54.8 65.1 71.0 78.8 76.7 68.8 58.0 43.9 41.5 57.3
2013 35.1 33.9 40.1 53.0 62.8 72.7 79.8 74.6 67.9 60.2 45.3 38.5 55.3
2014 28.6 31.6 37.7 52.3 64.0 72.5 76.1 74.5 69.7 59.6 45.3 40.5 54.4
2015 29.9 23.9 38.1 54.3 68.5 71.2 78.8 79.0 74.5 58.0 52.8 50.8 56.7
2016 34.5 37.7 48.9 53.3 62.8 72.3 78.7 79.2 71.8 58.8 49.8 38.3 57.2
2017 38.0 41.6 39.2 57.2 61.1 72.0 76.8 74.0 70.5 64.1 46.6 33.4 56.3
2018 31.7 42.0 40.1 49.5 66.9 71.7 77.6 78.1 70.7 57.7 44.4 40.1 55.9
2019 32.5 36.2 41.7 55.5 62.2 71.7 79.6 75.5 70.4 59.9 43.9 38.3 55.6
2020 39.1 40.1 48.0 50.4 60.3 73.7 80.0 76.9 68.8 57.9 53.0 39.2 57.3`

export const exampleChartJsDataForTesla = {
  type: 'bar',
  data: {
    labels: [
      'Profit Margin',
      'Operating Margin',
      'Return on Assets',
      'Return on Equity',
      'Revenue',
      'Revenue Per Share',
      'Quarterly Revenue Growth',
      'Gross Profit',
      'EBITDA',
      'Net Income Avi to Common',
      'Diluted EPS',
      'Quarterly Earnings Growth',
      'Total Cash',
      'Total Cash Per Share',
      'Total Debt',
      'Total Debt/Equity',
      'Current Ratio',
      'Book Value Per Share',
      'Operating Cash Flow',
      'Levered Free Cash Flow',
    ],
    datasets: [
      {
        label: 'Tesla Stock Price - Financial Highlights',
        data: [
          11.21, 7.55, 7.96, 22.46, 95.92, 30.28, 8.8, 20.85, 15.15, 10.79, 3.1,
          -43.7, 26.08, 8.2, 8.19, 15.02, 1.69, 16.82, 12.16, 1.61,
        ],
        backgroundColor: [
          '#3e95cd',
          '#8e5ea2',
          '#3cba9f',
          '#e8c3b9',
          '#c45850',
          '#3e95cd',
          '#8e5ea2',
          '#3cba9f',
          '#e8c3b9',
          '#c45850',
          '#3e95cd',
          '#8e5ea2',
          '#3cba9f',
          '#e8c3b9',
          '#c45850',
          '#3e95cd',
          '#8e5ea2',
          '#3cba9f',
          '#e8c3b9',
          '#c45850',
        ],
      },
    ],
  },
  options: {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Tesla Stock Price - Financial Highlights',
    },
    plugins: {
      title: {
        display: true,
        text: 'Tesla Stock Price - Financial Highlights',
      },
    },
    scales: {
      x: {
        axis: 'x',
        type: 'category',
        offset: true,
        grid: {
          offset: true,
          display: true,
          lineWidth: 1,
          drawOnChartArea: true,
          drawTicks: true,
          tickLength: 8,
          color: 'rgba(0,0,0,0.1)',
        },
        ticks: {
          minRotation: 0,
          maxRotation: 50,
          mirror: false,
          textStrokeWidth: 0,
          textStrokeColor: '',
          padding: 3,
          display: true,
          autoSkip: true,
          autoSkipPadding: 3,
          labelOffset: 0,
          minor: {},
          major: {},
          align: 'center',
          crossAlign: 'near',
          showLabelBackdrop: false,
          backdropColor: 'rgba(255, 255, 255, 0.75)',
          backdropPadding: 2,
          color: '#666',
        },
        display: true,
        reverse: false,
        beginAtZero: false,
        bounds: 'ticks',
        clip: true,
        grace: 0,
        border: {
          display: true,
          dash: [],
          dashOffset: 0,
          width: 1,
          color: 'rgba(0,0,0,0.1)',
        },
        title: {
          display: false,
          text: '',
          padding: {
            top: 4,
            bottom: 4,
          },
          color: '#666',
        },
        id: 'x',
        position: 'bottom',
      },
      y: {
        axis: 'y',
        type: 'linear',
        beginAtZero: true,
        ticks: {
          minRotation: 0,
          maxRotation: 50,
          mirror: false,
          textStrokeWidth: 0,
          textStrokeColor: '',
          padding: 3,
          display: true,
          autoSkip: true,
          autoSkipPadding: 3,
          labelOffset: 0,
          minor: {},
          major: {},
          align: 'center',
          crossAlign: 'near',
          showLabelBackdrop: false,
          backdropColor: 'rgba(255, 255, 255, 0.75)',
          backdropPadding: 2,
          color: '#666',
        },
        display: true,
        offset: false,
        reverse: false,
        bounds: 'ticks',
        clip: true,
        grace: 0,
        grid: {
          display: true,
          lineWidth: 1,
          drawOnChartArea: true,
          drawTicks: true,
          tickLength: 8,
          offset: false,
          color: 'rgba(0,0,0,0.1)',
        },
        border: {
          display: true,
          dash: [],
          dashOffset: 0,
          width: 1,
          color: 'rgba(0,0,0,0.1)',
        },
        title: {
          display: false,
          text: '',
          padding: {
            top: 4,
            bottom: 4,
          },
          color: '#666',
        },
        id: 'y',
        position: 'left',
      },
    },
  },
}
