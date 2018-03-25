import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UniverseService } from '../../../core/services/universe.service';
import { Observable } from 'rxjs/Observable';
import { IChartConfig } from '../line-chart/line-chart.component';

@Component({
    selector: 'app-action-menu',
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.css']
})
export class ActionMenuComponent implements OnInit {
    constructor(private universe: UniverseService, private cd: ChangeDetectorRef) {}

    charts: {
        ageDistribution?: IChartConfig;
        pregnancyDistribution?: IChartConfig;
        defaultMortalityDistribution?: IChartConfig;
        childMortalityDistribution?: IChartConfig;
    } = {};

    ngOnInit() {
        // TODO: make universe state observable and introduce some kind of buffer e.g. update each 10 ticks or so (or each year)?
        Observable.timer(0, 1000).subscribe(() => this.updateChartData());
    }

    spawnCreature() {
        this.universe.spawnCreatures();
    }

    getStats() {
        return [
            {
                name: 'Creatures',
                value: this.universe.getState().creatures
            },
            {
                name: 'Current year',
                value: this.universe.getState().currentYear
            },
            {
                name: 'Mean life expectancy',
                value: this.universe.getState().defaultMortalityDistribution.mean
            },
            {
                name: 'Mean pregnancy age',
                value: this.universe.getState().pregnancyDistribution.mean
            }
        ];
    }

    private updateChartData() {
        this.charts.ageDistribution = this.getAgeDistributionChart();
        this.charts.pregnancyDistribution = this.getPregnancyDistributionChart();
        this.charts.defaultMortalityDistribution = this.getDefaultMortalityDistributionChart();
        this.charts.childMortalityDistribution = this.getChildMortalityDistributionChart();
    }

    private getPregnancyDistributionChart() {
        return this.ageDistToChart({
            getValue: age => this.universe.getState().pregnancyDistribution.pdf(age),
            seriesName: 'Age',
            yAxisLabel: 'Probability of pregnancy'
        });
    }

    private getAgeDistributionChart() {
        return this.ageDistToChart({
            getValue: age => this.universe.getState().ageDistribution[age] || 0,
            seriesName: 'Age',
            yAxisLabel: 'Population'
        });
    }

    private getDefaultMortalityDistributionChart() {
        return this.ageDistToChart({
            getValue: age => this.universe.getState().defaultMortalityDistribution.cdf(age),
            seriesName: 'Default mortality',
            yAxisLabel: 'Probability of being dead'
        });
    }

    private getChildMortalityDistributionChart() {
        return this.ageDistToChart({
            getValue: age => this.universe.getState().childMortalityDistribution.pdf(age),
            seriesName: 'Child mortality',
            yAxisLabel: 'Probability of dying'
        });
    }

    private ageDistToChart(options: { getValue: (age: number) => number; seriesName: string; yAxisLabel: string }) {
        const ages = this.getArray0To(this.universe.getState().ageDistribution.length + 10);
        return {
            data: [
                {
                    name: options.seriesName,
                    series: ages.map((num, age) => ({
                        name: age,
                        value: Math.round(options.getValue(age) * 100) / 100
                    }))
                }
            ],
            xAxisLabel: 'Age',
            yAxisLabel: options.yAxisLabel
        };
    }

    private getArray0To(max: number) {
        const a = [];
        for (let i = 0; i <= max; i++) {
            a.push(i);
        }
        return a;
    }
}
