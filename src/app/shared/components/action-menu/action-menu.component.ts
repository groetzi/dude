import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UniverseService } from '../../../core/services/universe.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-action-menu',
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.css']
})
export class ActionMenuComponent implements OnInit {
    constructor(private universe: UniverseService, private cd: ChangeDetectorRef) {}

    // chart options
    chartData = [];
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

    ngOnInit() {
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
                name: 'Reproduction rate',
                value: this.universe.getState().reproductionRate
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
        this.chartData = [
            {
                name: 'Age',
                series: this.universe.getState().ageDistribution.map((val, ind) => ({
                    name: ind,
                    value: val
                }))
            }
        ];
    }
}
