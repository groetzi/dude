import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
    constructor() {}

    // chart options
    @Input() chartData = [];
    view: any[] = [500, 200];
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Age';
    showYAxisLabel = true;
    yAxisLabel = 'Population';

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    ngOnInit() {}
}
