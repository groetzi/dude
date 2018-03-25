import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SimpleChangeGeneric } from '../../../core/models/simple-change.model';

export interface IChartConfig {
    data?: Array<{
        name: string;
        series: Array<{
            name: string | number;
            value: number;
        }>;
    }>;
    showXAxis?: boolean;
    showYAxis?: boolean;
    gradient?: boolean;
    showLegend?: boolean;
    showXAxisLabel?: boolean;
    xAxisLabel?: string;
    showYAxisLabel?: boolean;
    yAxisLabel?: string;
    view?: any[];
    colorScheme?: {
        domain: string[];
    };
}

interface IChanges extends SimpleChanges {
    chartConfig: SimpleChangeGeneric<IChartConfig>;
}

const DEFAULT_CHART_CONFIG: IChartConfig = {
    data: [],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: false,
    showXAxisLabel: true,
    xAxisLabel: 'Age',
    showYAxisLabel: true,
    yAxisLabel: 'Population',
    view: [500, 200],
    colorScheme: {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    }
};

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {
    constructor() {}

    @Input() chartConfig: IChartConfig = DEFAULT_CHART_CONFIG;

    ngOnInit() {}

    ngOnChanges(changes: IChanges) {
        if (changes.chartConfig) {
            this.chartConfig = {
                ...DEFAULT_CHART_CONFIG,
                ...changes.chartConfig.currentValue
            };
        }
    }
}
